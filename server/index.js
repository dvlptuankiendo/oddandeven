import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cron from "cron";

import routes from "./routes/index.js";
import resultService from "./services/result.service.js";
import rankingService from "./services/ranking.service.js";

dotenv.config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// connect mongodb using mongoose
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { autoIndex: true, autoCreate: true });

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connected successfully!")
);

process.setMaxListeners(Infinity);

// declare middleware chain
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

app.use("/api", routes);

const server = http.createServer(app);

// socket
const socketIo = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  socket.on("message", (data) => {
    socketIo.emit("newmessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const TIME_PER_BET = 120;
let count = TIME_PER_BET;
let isProcessing = false;

const resultMessage = (result) => {
  let text1 = "LẺ";
  let text2 = "TÀI";

  if (result % 2 === 0) text1 = "CHẴN";
  if (result < 50) text2 = "XỈU";

  return `Kết quả con số may mắn: ${result}. Chúc mừng các bạn đặt ${text1} và ${text2}`;
};

const countdown = () => {
  if (isProcessing) return;
  setTimeout(async () => {
    isProcessing = true;
    if (!count) {
      const result = await resultService.createNewResult();
      socketIo.emit("newresult");
      socketIo.emit("newmessage", {
        sender: "Hệ thống",
        text: resultMessage(result),
        isSystem: true,
      });
      count = TIME_PER_BET;
    } else {
      --count;
      socketIo.emit("countdown", { count });
    }
    isProcessing = false;
    countdown();
  }, 1000);
};

countdown();

// cron job
const job = new cron.CronJob({
  cronTime: "00 00 00 * * 0-6", // job runs at 0h00 everyday
  onTick: async function () {
    await rankingService.updateDailyRanking();
  },
  start: true,
});

job.start();

const port = process.env.PORT || 8888;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

rankingService.updateDailyRanking();
