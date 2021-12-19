import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import routes from "./routes/index.js";
import resultService from "./services/result.service.js";

dotenv.config();

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

const socketIo = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const TIME_PER_BET = 120;

let count = TIME_PER_BET;
let isProcessing = false;

const countdown = () => {
  if (isProcessing) return;
  setTimeout(async () => {
    isProcessing = true;
    if (!count) {
      await resultService.createNewResult();
      socketIo.emit("newresult");
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

const port = process.env.PORT || 8888;
server.listen(port, () => {
  console.log("Server is running");
});
