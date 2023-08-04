"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRouter = void 0;
const express_1 = __importDefault(require("express"));
const Invoice_model_1 = require("../models/Invoice.model");
const sacCodesData_1 = require("./sacCodesData");
const invoiceRouter = express_1.default.Router();
exports.invoiceRouter = invoiceRouter;
function checkSACcode(itemName) {
    return sacCodesData_1.sacCodes.find((sacCode) => sacCode.description.toLowerCase() === itemName.toLowerCase());
}
// CREATING NEW INVOICE
invoiceRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerName, address, emailId, items } = req.body;
        // Calculating tax and SAC code for each item
        const processedItems = items.map((item) => {
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
        const totalAmount = processedItems.reduce((acc, item) => acc + item.rate + item.taxAmount, 0);
        // Creating New Invoice Document
        const newInvoice = new Invoice_model_1.InvoiceModel({
            customerName,
            address,
            emailId,
            items: processedItems,
            taxAmount: totalAmount -
                items.reduce((acc, item) => acc + item.rate, 0),
        });
        // Saving New Invoice
        yield newInvoice.save();
        res
            .status(201)
            .json({ message: "Invoice created successfully", data: newInvoice });
    }
    catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// GET ALL INVOICES
invoiceRouter.get("/allinvoices", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield Invoice_model_1.InvoiceModel.find();
        res.status(200).json({ invoices });
    }
    catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// GET INVOICE BY ID
invoiceRouter.get("/invoices/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const invoice = yield Invoice_model_1.InvoiceModel.findById(id);
        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        res.status(200).json({ data: invoice });
    }
    catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
//EDIT INVOICE
invoiceRouter.patch("/editinvoice/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { customerName, address, emailId, items } = req.body;
    try {
        const invoice = yield Invoice_model_1.InvoiceModel.findById(id);
        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        // Calculating taxes and associate SAC Code for each item
        const processedItems = items.map((item) => {
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
        const totalAmount = processedItems.reduce((acc, item) => acc + item.rate + item.taxAmount, 0);
        // Updating Invoice Properties
        invoice.customerName = customerName;
        invoice.address = address;
        invoice.emailId = emailId;
        invoice.items = processedItems;
        invoice.taxAmount =
            totalAmount -
                items.reduce((acc, item) => acc + item.rate, 0);
        // Saving Updated Invoice Here
        yield invoice.save();
        res
            .status(200)
            .json({ message: "Invoice updated successfully", data: invoice });
    }
    catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// DELETE INVOICE
invoiceRouter.delete("/invoices/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const invoice = yield Invoice_model_1.InvoiceModel.findById(id);
        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        // Deleting here
        yield invoice.deleteOne();
        res.status(200).json({ message: "Invoice deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
