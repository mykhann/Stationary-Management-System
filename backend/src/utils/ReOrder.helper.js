import Item from "../model/item.model.js";
import Reorder from "../model/reorder.model.js";
import { sendEmail } from "../middlewares/sendEmail.js";

export const reOrderHelper = async (itemId) => {
  const item = await Item.findById(itemId).populate("supplier");
  if (!item) return;

  const reorderLevel = item.reorderLevel ?? 15;
  const reorderStock = item.reorderStock ?? 50; // fallback if reorderStock is not set

  if (item.stock <= reorderLevel) {
    const existingReorder = await Reorder.findOne({
      itemId,
      status: "pending",
    });

    if (existingReorder) return;

    const reorder = await Reorder.create({
      itemId: item._id,
      stock: reorderStock,
      supplierId: item.supplier?._id || null,
    });

    if (item.supplier?.email) {
      const emailContent = `
        Dear ${item.supplier.name || "Supplier"},

        This is an automated reorder request for the item "${item.productName}".

        Current stock: ${item.stock}
        Reorder threshold: ${reorderLevel}
        Reorder quantity: ${reorder.stock}

        Please process this request promptly.

        Regards,
        Inventory Management System
      `;

      await sendEmail({
        to: item.supplier.email,
        subject: `Reorder Request for "${item.productName}"`,
        text: emailContent,
      });
    }
  } else {
    console.log(
      `Stock is sufficient for item: ${item.productName}, no reorder needed.`
    );
  }
};
