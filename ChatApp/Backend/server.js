// const express = require("express");
// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const { errorHandler } = require("./middleware/errorMiddleware");
// const chatRoutes = require("./routes/chatRoutes");
// const userRoutes = require("./routes/userRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const http = require("http"); // Required to create HTTP server for Socket.IO
// const { Server } = require("socket.io"); // Import Socket.IO

// const app = express();
// const server = http.createServer(app); // Create HTTP server for Socket.IO
// const io = new Server(server, {
//   pingTimeout: 60000, // Timeout if connection is idle
//   cors: {
//     origin: "*", // Allow all origins for now, configure it according to your needs
//   },
// });

// connectDB();

// app.use(express.json()); // Allows us to accept json data

// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

// app.use(errorHandler);

// // Initialize socket.io for real-time communication
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Join a chat room
//   socket.on("joinChat", (chatId) => {
//     socket.join(chatId);
//     console.log(`User joined chat room: ${chatId}`);
//   });

//   // Listen for a new message and broadcast it to the same chat room
//   socket.on("newMessage", (newMessage) => {
//     const chatId = newMessage.chat._id;

//     // Broadcast the new message to all users in the chat room except the sender
//     socket.to(chatId).emit("messageReceived", newMessage);
//   });

//   // Disconnect user
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// server.js

const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandler);

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join a chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Listen for new messages and broadcast to the chat room
  socket.on("newMessage", (newMessage) => {
    const chatId = newMessage.chat._id;
    socket.to(chatId).emit("messageReceived", newMessage);
  });

  // Handle typing indication
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing", socket.id);
  });

  socket.on("stop typing", (chatId) => {
    socket.to(chatId).emit("stop typing", socket.id);
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
