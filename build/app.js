"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./config/config");
const config_1 = require("./server/config");
const server = new config_1.Server();
server.listen();
