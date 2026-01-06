// api/src/controllers/admin/ordersController.js
import { adminOrdersService } from "../../services/admin/adminOrders.service.js";

function sendError(res, error) {
  const code = error.statusCode || 500;
  const payload = { error: error.message || "Internal server error" };
  if (error.details) payload.details = error.details;
  return res.status(code).json(payload);
}

export const getAllOrders = async (req, res) => {
  try {
    const result = await adminOrdersService.list(req.query);
    return res.json(result);
  } catch (error) {
    console.error("Admin getAllOrders error:", error);
    return sendError(res, error);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await adminOrdersService.getById(req.params.id);
    return res.json({ order });
  } catch (error) {
    console.error("Admin getOrderById error:", error);
    return sendError(res, error);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: "status is required" });

    const order = await adminOrdersService.updateStatus(req.params.id, status);
    return res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Admin updateOrderStatus error:", error);
    return sendError(res, error);
  }
};

export const updateOrderShipping = async (req, res) => {
  try {
    const order = await adminOrdersService.updateShipping(req.params.id, req.body || {});
    return res.json({ message: "Order shipping updated successfully", order });
  } catch (error) {
    console.error("Admin updateOrderShipping error:", error);
    return sendError(res, error);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await adminOrdersService.delete(req.params.id);
    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Admin deleteOrder error:", error);
    return sendError(res, error);
  }
};
