// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Location = require("./Location");
const dotenv = require("dotenv");
const http = require("http"); // Import the http module
const socketIo = require("socket.io"); // Import socket.io
const path = require("path");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/", express.static(path.join(__dirname, "Frontend/dist")));

const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
}); // Create a WebSocket server

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // You can implement more logic here for handling WebSocket connections.

  socket.on("location_update", (data) => {
    socket.broadcast.emit("location_update", data);

    console.log(data)
  });
  // For example, you can send a welcome message:
  socket.emit("message", "Welcome to the vehicle tracking WebSocket server");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/dist", "index.html"));
});

// app.post("/api/track", async (req, res) => {
//   try {
//     const { vehicleId, latitude, longitude, timestamp } = req.body;
//     const location = new Location({
//       vehicleId,
//       latitude,
//       longitude,
//       timestamp,
//     });
//     await location.save();

//     // Send the new location data to connected WebSocket clients
//     io.emit("locationUpdate", location);

//     res.status(201).json({ message: "Location saved successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
