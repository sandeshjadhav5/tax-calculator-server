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
const express_1 = __importDefault(require("express"));
const db_1 = require("./configs/db");
const User_routes_1 = require("./routes/User.routes");
const Invoice_routes_1 = require("./routes/Invoice.routes");
const cors = require("cors");
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors({ origin: "*" }));
app.get("/api/v1", (req, res) => {
    res.send("Welcome to Mokaro");
});
app.use("/api/v1/users", User_routes_1.userRouter);
app.use("/api/v1/invoices", Invoice_routes_1.invoiceRouter);
//Starting the server
const port = process.env.port || 5000;
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.connection;
        console.log("Connected to the DB");
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Listening at port :${port}`);
}));
