const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const courseRoutes = require("./routes/courses");
const imageRoutes = require('./routes/images');


const app = express();
const PORT = 9999;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
.connect("mongodb://127.0.0.1:27017/Lab2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/courses", courseRoutes);
app.use('/images', imageRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
