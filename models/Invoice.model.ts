import { Document, Schema, model } from "mongoose";

// Interface for the Item in the items array
export interface Item {
  itemName: string;
  quantity: number;
  rate: number;
  gstRate?: number;
}

// Interface for the Invoice
export interface InvoiceDocument extends Document {
  customerName: string;
  address: string;
  emailId: string;
  items: Item[];
  taxAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<Item>({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  gstRate: { type: Number },
});

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    emailId: { type: String, required: true },
    items: [itemSchema],
    taxAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const InvoiceModel = model<InvoiceDocument>("Invoice", invoiceSchema);

export { InvoiceModel };
