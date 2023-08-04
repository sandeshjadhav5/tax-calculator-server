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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_model_1 = require("../models/User.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = require("jsonwebtoken");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
// REGISTER
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // H A S H I N G
    try {
        bcrypt_1.default.hash(password, 8, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                res.send("Error in Registration");
            }
            else {
                const user = new User_model_1.UserModel({
                    name,
                    email,
                    password: hashedPassword,
                });
                yield user.save();
                res.send(`${name}, You are Successfully Registered`);
            }
        }));
    }
    catch (err) {
        res.send("Error in Registration");
        console.log(err);
    }
}));
// LOGIN
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_model_1.UserModel.findOne({ email });
        if (user) {
            const hashed_password = user.password;
            bcrypt_1.default.compare(password, hashed_password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id }, process.env.key, {
                        expiresIn: "1d",
                    });
                    console.log("Login Success");
                    res.status(200).send("Login Successful");
                }
                else {
                    res.status(400).send("Wrong Credentials");
                }
            });
        }
        else {
            res.status(400).send("Enter Correct Details");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something Went Wrong");
    }
}));
