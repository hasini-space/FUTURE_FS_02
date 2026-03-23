const leadRoutes = require("./routes/leadRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve static files from the "public" directory
// log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});
app.use("/api/leads", leadRoutes);

// 🔥 Paste your MongoDB connection string below
mongoose.connect("mongodb+srv://crmuser:onbH9ecXY3rF5a6i@cluster0.p4py6ub.mongodb.net/crmDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Mini CRM API is Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
