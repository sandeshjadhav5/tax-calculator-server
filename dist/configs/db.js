"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(`${process.env.mongoURI}`);
exports.connection = connection;
