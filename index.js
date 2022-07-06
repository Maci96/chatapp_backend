const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Server is running");
});
io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });
  socket.on("callUser", ({ userToCall, SignalData, From, name }) => {
    io.to(userToCall).emit("callUser", { signal: SignalData, From, name });
  });
  socket.on("answerCall", (data) => {
    console.log(data.to);
    io.to(data.to).emit("CallAccepted", data.signal);
  });
});
server.listen(PORT, () => console.log("Server Listening on Port :" + PORT));
