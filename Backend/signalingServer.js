import express from "express"
import createDebug from "debug"
import "dotenv/config"
import http from "http"
import wss from "./wss.js"
const app = express();
app.use(express.json());
const server = http.createServer(app);
const debug = createDebug(`${process.env.APPNAME || "webrtc-app"}:index`);
const HTTPPORT = 4000;
const WSSPORT = 8090;


wss.init(WSSPORT); 
console.log("Signaling server started");

server.listen(HTTPPORT,()=>{
    debug(`HTTP server is running on port : ${HTTPPORT}`)
})