const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/auth");
const menuRoutes = require("./routes/menuRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require('./routes/userRoutes');
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Allow all origins + cookies
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());

// Public route
app.use("/api/proxy", authRoutes);

// Protected routes
app.use("/api/proxy", authMiddleware);
app.use('/api/proxy', userRoutes);
app.use("/api/proxy", menuRoutes);
app.use("/api/proxy", roleRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
