"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModel = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    gstRate: { type: Number },
});
const invoiceSchema = new mongoose_1.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    emailId: { type: String, required: true },
    items: [itemSchema],
    taxAmount: { type: Number, required: true },
}, { timestamps: true });
const InvoiceModel = (0, mongoose_1.model)("Invoice", invoiceSchema);
exports.InvoiceModel = InvoiceModel;
