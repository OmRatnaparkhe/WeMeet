import express from "express"
import createDebug from "debug"
import "dotenv/config"
import wss from "./wss.js"
const app = express();
app.use(express.json());
const debug = createDebug(`${process.env.APPNAME || "webrtc-app"}:index`);
const WSSPORT = 8070;


wss.init(WSSPORT); 
console.log("Signaling server started");
