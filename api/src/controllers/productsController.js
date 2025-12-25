// api/src/controllers/productsController.js
import { query } from "../config/database.js";

const toInt = (v, def = 0) => {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : def;
};

const normalizeSlug = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

async function loadProductCategories(productId) {
  return query(
    `
    SELECT pc.*
    FROM product_categories pc
    INNER JOIN product_category_pivot pcp
      ON pc.id = pcp.category_id
    WHERE pcp.product_id = ?
    ORDER BY pc.display_order, pc.name
    `,
    [productId]
  );
}

async function loadProductImages(productId) {
  return query(
    "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order",
    [productId]
  );
}

async function loadProductReviews(productId) {
  return query(
    "SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 10",
    [productId]
  );
}

function parseBenefits(product) {
  if (product?.benefits && typeof product.benefits === "string") {
    try {
      product.benefits = JSON.parse(product.benefits);
    } catch {
      product.benefits = [];
    }
  } else if (!product?.benefits) {
    product.benefits = [];
  }
  return product;
}

export const getAllProducts = async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT DISTINCT p.*
      FROM products p
      LEFT JOIN product_category_pivot pcp ON p.id = pcp.product_id
      LEFT JOIN product_categories pc ON pc.id = pcp.category_id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += " AND pc.slug = ?";
      params.push(category);
    }

    if (featured === "true") {
      sql += " AND p.is_featured = 1";
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(toInt(limit, 50), toInt(offset, 0));

    const products = await query(sql, params);

    for (const p of products) parseBenefits(p);

    res.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const products = await query("SELECT * FROM products WHERE slug = ? LIMIT 1", [
      slug,
    ]);

    if (!products[0]) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = parseBenefits(products[0]);

    product.categories = await loadProductCategories(product.id);
    product.images = await loadProductImages(product.id);
    product.reviews = await loadProductReviews(product.id);

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ----------- ADMIN CRUD -----------

export const getProductByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });

    const product = parseBenefits(rows[0]);
    product.categories = await loadProductCategories(product.id);
    product.images = await loadProductImages(product.id);

    res.json({ product });
  } catch (error) {
    console.error("Get product admin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description = null,
      short_description = null,
      price,
      compare_at_price = null,
      image_url = null,
      stock_status = "in_stock",
      is_featured = false,
      is_new = false,
      ingredients = null,
      usage = null,
      benefits = [],
      category_ids = [], // product_categories.id[]
    } = req.body ?? {};

    if (!name) return res.status(400).json({ error: "name is required" });
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ error: "price is required and must be >= 0" });
    }

    const finalSlug = normalizeSlug(slug || name);
    if (!finalSlug) return res.status(400).json({ error: "Invalid slug" });

    const exists = await query("SELECT id FROM products WHERE slug = ? LIMIT 1", [
      finalSlug,
    ]);
    if (exists.length) return res.status(409).json({ error: "Slug already exists" });

    const idRows = await query("SELECT UUID() AS id");
    const id = idRows[0].id;

    await query(
      `
      INSERT INTO products
        (id, name, slug, description, short_description, price, compare_at_price, image_url,
         stock_status, is_featured, is_new, ingredients, \`usage\`, benefits)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        name,
        finalSlug,
        description,
        short_description,
        Number(price),
        compare_at_price !== null ? Number(compare_at_price) : null,
        image_url,
        stock_status,
        is_featured ? 1 : 0,
        is_new ? 1 : 0,
        ingredients,
        usage,
        JSON.stringify(Array.isArray(benefits) ? benefits : []),
      ]
    );

    const ids = asArray(category_ids).filter(Boolean);
    if (ids.length) {
      const found = await query(
        `SELECT id FROM product_categories WHERE id IN (${ids
          .map(() => "?")
          .join(",")})`,
        ids
      );
      if (found.length !== ids.length) {
        return res.status(400).json({ error: "One or more category_ids are invalid" });
      }

      await query(
        `
        INSERT INTO product_category_pivot (product_id, category_id)
        VALUES ${ids.map(() => "(?, ?)").join(",")}
        `,
        ids.flatMap((cid) => [id, cid])
      );
    }

    const [product] = await query("SELECT * FROM products WHERE id = ?", [id]);
    parseBenefits(product);
    product.categories = await loadProductCategories(id);
    product.images = await loadProductImages(id);
    product.reviews = [];

    res.status(201).json({ product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [
      id,
    ]);
    if (!existing[0]) return res.status(404).json({ error: "Product not found" });

    const {
      name,
      slug,
      description,
      short_description,
      price,
      compare_at_price,
      image_url,
      stock_status,
      is_featured,
      is_new,
      ingredients,
      usage,
      benefits,
      category_ids, // optional: replace all categories
    } = req.body ?? {};

    const patch = [];
    const params = [];

    if (name !== undefined) {
      if (!name) return res.status(400).json({ error: "name cannot be empty" });
      patch.push("name = ?");
      params.push(name);
    }

    if (slug !== undefined) {
      const finalSlug = normalizeSlug(slug || "");
      if (!finalSlug) return res.status(400).json({ error: "Invalid slug" });

      const slugExists = await query(
        "SELECT id FROM products WHERE slug = ? AND id <> ? LIMIT 1",
        [finalSlug, id]
      );
      if (slugExists.length) return res.status(409).json({ error: "Slug already exists" });

      patch.push("slug = ?");
      params.push(finalSlug);
    }

    if (description !== undefined) {
      patch.push("description = ?");
      params.push(description);
    }

    if (short_description !== undefined) {
      patch.push("short_description = ?");
      params.push(short_description);
    }

    if (price !== undefined) {
      if (price === null || Number(price) < 0) {
        return res.status(400).json({ error: "price must be >= 0" });
      }
      patch.push("price = ?");
      params.push(Number(price));
    }

    if (compare_at_price !== undefined) {
      patch.push("compare_at_price = ?");
      params.push(compare_at_price === null ? null : Number(compare_at_price));
    }

    if (image_url !== undefined) {
      patch.push("image_url = ?");
      params.push(image_url);
    }

    if (stock_status !== undefined) {
      patch.push("stock_status = ?");
      params.push(stock_status);
    }

    if (is_featured !== undefined) {
      patch.push("is_featured = ?");
      params.push(is_featured ? 1 : 0);
    }

    if (is_new !== undefined) {
      patch.push("is_new = ?");
      params.push(is_new ? 1 : 0);
    }

    if (ingredients !== undefined) {
      patch.push("ingredients = ?");
      params.push(ingredients);
    }

    if (usage !== undefined) {
      patch.push("`usage` = ?");
      params.push(usage);
    }

    if (benefits !== undefined) {
      patch.push("benefits = ?");
      params.push(JSON.stringify(Array.isArray(benefits) ? benefits : []));
    }

    if (patch.length) {
      await query(`UPDATE products SET ${patch.join(", ")} WHERE id = ?`, [
        ...params,
        id,
      ]);
    }

    if (category_ids !== undefined) {
      const ids = asArray(category_ids).filter(Boolean);

      if (ids.length) {
        const found = await query(
          `SELECT id FROM product_categories WHERE id IN (${ids
            .map(() => "?")
            .join(",")})`,
          ids
        );
        if (found.length !== ids.length) {
          return res.status(400).json({ error: "One or more category_ids are invalid" });
        }
      }

      await query("DELETE FROM product_category_pivot WHERE product_id = ?", [id]);

      if (ids.length) {
        await query(
          `
          INSERT INTO product_category_pivot (product_id, category_id)
          VALUES ${ids.map(() => "(?, ?)").join(",")}
          `,
          ids.flatMap((cid) => [id, cid])
        );
      }
    }

    const [product] = await query("SELECT * FROM products WHERE id = ?", [id]);
    parseBenefits(product);
    product.categories = await loadProductCategories(id);
    product.images = await loadProductImages(id);
    product.reviews = await loadProductReviews(id);

    res.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await query("SELECT id FROM products WHERE id = ? LIMIT 1", [
      id,
    ]);
    if (!exists[0]) return res.status(404).json({ error: "Product not found" });

    // images + pivots are safe to delete explicitly (FK cascade exists for images; pivot has cascade too)
    await query("DELETE FROM product_category_pivot WHERE product_id = ?", [id]);
    await query("DELETE FROM product_images WHERE product_id = ?", [id]);
    await query("DELETE FROM products WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
