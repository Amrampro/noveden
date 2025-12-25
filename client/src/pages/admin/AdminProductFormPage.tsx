// client/src/pages/admin/AdminProductFormPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import type { ProductCategory } from "../../lib/types";

type StockStatus = "in_stock" | "limited" | "out_of_stock";

type FormState = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string; // keep as string for input
  compare_at_price: string;

  // ✅ Will store ONLY a URL like https://your-domain/uploads/products/xxx.jpg
  image_url: string;

  stock_status: StockStatus;
  is_featured: boolean;
  is_new: boolean;
  ingredients: string;
  usage: string;

  benefitsText: string; // newline list -> benefits[]
  category_ids: string[];
};

const emptyForm = (): FormState => ({
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  compare_at_price: "",
  image_url: "",
  stock_status: "in_stock",
  is_featured: false,
  is_new: false,
  ingredients: "",
  usage: "",
  benefitsText: "",
  category_ids: [],
});

function normalizeSlug(s: string) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function benefitsFromText(text: string): any[] {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines; // array of strings
}

function benefitsToText(benefits: any): string {
  if (Array.isArray(benefits)) return benefits.map(String).join("\n");
  return "";
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm());
  const [slugTouched, setSlugTouched] = useState(false);

  // Image upload state
  const [imageBusy, setImageBusy] = useState(false);
  const [imageMeta, setImageMeta] = useState<{ name?: string; sizeKb?: number } | null>(
    null
  );

  const categoryOptions = useMemo(() => {
    const sorted = [...categories];
    sorted.sort((a: any, b: any) => {
      const ao = Number(a.display_order ?? 0);
      const bo = Number(b.display_order ?? 0);
      if (ao !== bo) return ao - bo;
      return String(a.name ?? "").localeCompare(String(b.name ?? ""));
    });
    return sorted;
  }, [categories]);

  // auto-generate slug unless user touched it
  useEffect(() => {
    if (slugTouched) return;
    setForm((f) => ({ ...f, slug: normalizeSlug(f.name) }));
  }, [form.name, slugTouched]);

  async function loadAll() {
    setError(null);
    setLoading(true);
    try {
      const cats = await productService.listCategories();
      setCategories(cats.categories || []);

      if (isEdit && id) {
        const { product } = await productService.adminGetProductById(id);

        const catIds =
          Array.isArray((product as any).categories)
            ? (product as any).categories.map((c: any) => c.id)
            : [];

        setForm({
          name: (product as any).name ?? "",
          slug: (product as any).slug ?? "",
          short_description: (product as any).short_description ?? "",
          description: (product as any).description ?? "",
          price: String((product as any).price ?? ""),
          compare_at_price:
            (product as any).compare_at_price == null
              ? ""
              : String((product as any).compare_at_price),

          // ✅ already stored in DB as URL
          image_url: (product as any).image_url ?? "",

          stock_status: ((product as any).stock_status ?? "in_stock") as StockStatus,
          is_featured: Boolean((product as any).is_featured),
          is_new: Boolean((product as any).is_new),
          ingredients: (product as any).ingredients ?? "",
          usage: (product as any).usage ?? "",
          benefitsText: benefitsToText((product as any).benefits),
          category_ids: catIds,
        });

        setSlugTouched(true);
      } else {
        setForm(emptyForm());
        setSlugTouched(false);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load form data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function toggleCategory(catId: string) {
    setForm((f) => {
      const exists = f.category_ids.includes(catId);
      return {
        ...f,
        category_ids: exists
          ? f.category_ids.filter((x) => x !== catId)
          : [...f.category_ids, catId],
      };
    });
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Name is required";
    const finalSlug = normalizeSlug(form.slug || form.name);
    if (!finalSlug) return "Invalid slug";

    if (form.price.trim() === "") return "Price is required";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) return "Price must be a number >= 0";

    if (form.compare_at_price.trim() !== "") {
      const cap = Number(form.compare_at_price);
      if (!Number.isFinite(cap) || cap < 0)
        return "Compare at price must be a number >= 0";
    }

    const allowed: StockStatus[] = ["in_stock", "limited", "out_of_stock"];
    if (!allowed.includes(form.stock_status)) return "Invalid stock status";

    // Optional: require image URL
    // if (!form.image_url) return "Please upload an image";

    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) return setError(v);

    setBusy(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: normalizeSlug(form.slug || form.name),
        short_description: form.short_description.trim() || null,
        description: form.description.trim() || null,
        price: Number(form.price),
        compare_at_price:
          form.compare_at_price.trim() === "" ? null : Number(form.compare_at_price),

        // ✅ URL saved in DB
        image_url: form.image_url.trim() || null,

        stock_status: form.stock_status,
        is_featured: form.is_featured,
        is_new: form.is_new,
        ingredients: form.ingredients.trim() || null,
        usage: form.usage.trim() || null,
        benefits: benefitsFromText(form.benefitsText),
        category_ids: form.category_ids,
      };

      if (isEdit && id) {
        await productService.adminUpdateProduct(id, payload as any);
      } else {
        await productService.adminCreateProduct(payload as any);
      }

      navigate("/admin/products");
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  // ✅ Upload to your API => returns { url }
  async function handlePickImage(file: File | null) {
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Unsupported image type. Use PNG, JPG, JPEG, or WEBP.");
      return;
    }

    // should match backend limit (example 4MB)
    const maxBytes = 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("Image is too large. Please choose an image under 4MB.");
      return;
    }

    setError(null);
    setImageBusy(true);
    try {
      // ✅ UPLOAD to API
      const { url } = await productService.uploadProductImage(file);

      // ✅ store returned URL in form
      setForm((f) => ({ ...f, image_url: url }));
      setImageMeta({ name: file.name, sizeKb: Math.round(file.size / 1024) });
    } catch (e: any) {
      setError(e?.message || "Failed to upload image");
    } finally {
      setImageBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Edit product" : "Create product"}
          </h1>
          <p className="text-gray-600">
            {isEdit
              ? "Update product details and categories."
              : "Fill the form to create a new product."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Back to list
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white border rounded-xl p-5 space-y-5">
        <Section title="Basic information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name *">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
            </Field>

            <Field label="Slug *">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: e.target.value }));
                }}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
              <div className="text-xs text-gray-500 mt-1">
                Auto-generated from name unless edited.
              </div>
            </Field>

            <Field label="Short description">
              <input
                value={form.short_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
            </Field>

            {/* ✅ Upload image from device, store URL */}
            <Field label="Main image (upload from device)">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Selected"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-xs text-gray-400">No image</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      disabled={busy || imageBusy}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        e.currentTarget.value = "";
                        handlePickImage(file);
                      }}
                    />
                    {imageBusy ? "Uploading..." : form.image_url ? "Change image" : "Choose image"}
                  </label>

                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, image_url: "" }));
                        setImageMeta(null);
                      }}
                      className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      disabled={busy || imageBusy}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {imageMeta && (
                <div className="text-xs text-gray-500 mt-2">
                  {imageMeta.name} • {imageMeta.sizeKb} KB
                </div>
              )}

              {form.image_url && (
                <div className="text-[11px] text-gray-400 mt-1">
                  Stored as URL: {form.image_url}
                </div>
              )}
            </Field>

            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/20"
                  disabled={busy}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Pricing & stock">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Price *">
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
            </Field>

            <Field label="Compare at price">
              <input
                type="number"
                step="0.01"
                value={form.compare_at_price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, compare_at_price: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
            </Field>

            <Field label="Stock status">
              <select
                value={form.stock_status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock_status: e.target.value as StockStatus }))
                }
                className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              >
                <option value="in_stock">In stock</option>
                <option value="limited">Limited</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </Field>

            <div className="md:col-span-3 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_featured: e.target.checked }))
                  }
                  disabled={busy}
                />
                Featured
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_new}
                  onChange={(e) => setForm((f) => ({ ...f, is_new: e.target.checked }))}
                  disabled={busy}
                />
                New
              </label>
            </div>
          </div>
        </Section>

        <Section title="Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Ingredients">
              <textarea
                value={form.ingredients}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ingredients: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border min-h-[90px] focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
            </Field>

            <Field label="Usage">
              <textarea
                value={form.usage}
                onChange={(e) => setForm((f) => ({ ...f, usage: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border min-h-[90px] focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled={busy}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Benefits (one per line)">
                <textarea
                  value={form.benefitsText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, benefitsText: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder={`Example:\nHydrates skin\nReduces acne\nGlow effect`}
                  disabled={busy}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Categories">
          {categoryOptions.length === 0 ? (
            <div className="text-sm text-gray-600">
              No categories found. Create categories first in “Catégory de produit”.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categoryOptions.map((c: any) => {
                const checked = form.category_ids.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={[
                      "flex items-center gap-2 p-3 rounded-lg border cursor-pointer",
                      checked ? "bg-gray-50 border-gray-300" : "bg-white hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(c.id)}
                      disabled={busy}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.slug}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </Section>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
            disabled={busy || imageBusy}
          >
            {busy ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------- UI helpers ----------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="font-semibold text-gray-900">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-800 mb-1">{label}</div>
      {children}
    </label>
  );
}
