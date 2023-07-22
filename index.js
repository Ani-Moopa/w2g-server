const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("recieved_message", msg);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("user joined room: " + data);
    socket.to(data).emit("user_joined", data);
  });

  socket.on("play", (data) => {
    console.log("play: " + JSON.stringify(data));
    socket.to(data.room).emit("play_video", JSON.stringify(data));
  });

  socket.on("pause", (data) => {
    console.log("pause: " + JSON.stringify(data));
    socket.to(data.room).emit("pause_video", JSON.stringify(data));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3002, () => {
  console.log("listening on 3002");
});
