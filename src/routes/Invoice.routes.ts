import express, { Request, Response } from "express";
import { InvoiceModel, InvoiceDocument } from "../models/Invoice.model";
import { sacCodes } from "./sacCodesData";

// Item Interface
interface Item {
  itemName: string;
  quantity: number;
  rate: number;
  taxAmount: number;
}

// SAC Codes Interface
interface SACCode {
  id: number;
  code: string;
  description: string;
  gstRate: number;
}

const invoiceRouter = express.Router();

function checkSACcode(itemName: string): SACCode | undefined {
  return sacCodes.find(
    (sacCode) => sacCode.description.toLowerCase() === itemName.toLowerCase()
  );
}

// CREATING NEW INVOICE

invoiceRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const { customerName, address, emailId, items } = req.body;

    // Calculating tax and SAC code for each item
    const processedItems = items.map((item: Item) => {
      const { itemName, quantity, rate } = item;

      const sacCode = checkSACcode(itemName);

      if (!sacCode) {
        return { error: `SAC Code not found for item: ${itemName}` };
      }

      // Calculating tax amount for the Item
      const { gstRate } = sacCode;
      const taxAmount = (quantity * rate * gstRate) / 100;
      const totalAmount = rate + taxAmount;

      return {
        itemName,
        quantity,
        rate,
        gstRate,
        taxAmount,
        totalAmount,
        sacCode: sacCode.code,
      };
    });

    // Calculating total amount
    const totalAmount = processedItems.reduce(
      (acc: number, item: Item) => acc + item.rate + item.taxAmount,
      0
    );

    // Creating New Invoice Document
    const newInvoice: InvoiceDocument = new InvoiceModel({
      customerName,
      address,
      emailId,
      items: processedItems,
      taxAmount:
        totalAmount -
        items.reduce((acc: number, item: Item) => acc + item.rate, 0),
    });

    // Saving New Invoice
    await newInvoice.save();

    res
      .status(201)
      .json({ message: "Invoice created successfully", data: newInvoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET ALL INVOICES
invoiceRouter.get("/allinvoices", async (req: Request, res: Response) => {
  try {
    const invoices: InvoiceDocument[] = await InvoiceModel.find();
    res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET INVOICE BY ID
invoiceRouter.get("/invoices/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const invoice: InvoiceDocument | null = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json({ data: invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//EDIT INVOICE
invoiceRouter.patch("/editinvoice/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { customerName, address, emailId, items } = req.body;

  try {
    const invoice: InvoiceDocument | null = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Calculating taxes and associate SAC Code for each item
    const processedItems = items.map((item: Item) => {
      const { itemName, quantity, rate } = item;

      const sacCode = checkSACcode(itemName);

      if (!sacCode) {
        return { error: `SAC Code not found for item: ${itemName}` };
      }

      const { gstRate } = sacCode;

      // Calculating tax amount for the item
      const taxAmount = (quantity * rate * gstRate) / 100;
      const totalAmount = rate + taxAmount;

      return {
        itemName,
        quantity,
        rate,
        gstRate,
        taxAmount,
        totalAmount,
        sacCode: sacCode.code,
      };
    });

    // Calculating total amount
    const totalAmount = processedItems.reduce(
      (acc: number, item: Item) => acc + item.rate + item.taxAmount,
      0
    );

    // Updating Invoice Properties
    invoice.customerName = customerName;
    invoice.address = address;
    invoice.emailId = emailId;
    invoice.items = processedItems;
    invoice.taxAmount =
      totalAmount -
      items.reduce((acc: number, item: Item) => acc + item.rate, 0);

    // Saving Updated Invoice Here
    await invoice.save();

    res
      .status(200)
      .json({ message: "Invoice updated successfully", data: invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE INVOICE
invoiceRouter.delete("/invoices/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const invoice: InvoiceDocument | null = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Deleting here
    await invoice.deleteOne();

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { invoiceRouter };
