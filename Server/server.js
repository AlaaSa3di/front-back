// require("dotenv").config();
// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const jwt = require("jsonwebtoken");
// const cookiesParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const hpp = require("hpp");

// // Routes
// const userRoutes = require("./Routes/userRoutes");
// const authRoutes = require('./Routes/authRoutes');
// const spaceRoutes = require('./Routes/spaceRoutes');
// const screenRoutes = require('./Routes/screenRoutes');
// const contactRoutes = require('./Routes/contactRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'لقد تجاوزت عدد الطلبات المسموح بها، يرجى المحاولة مرة أخرى بعد 15 دقيقة'
// });

// // Middleware
// app.use(helmet());
// app.use(mongoSanitize());
// app.use(hpp());
// app.use(bodyParser.json());
// app.use(cookiesParser());
// app.use(
//   cors({
//     origin: (_, callback) => {
//       callback(null, true);
//     },
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(limiter);

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use('/api/spaces', spaceRoutes);
// app.use('/api/screens', screenRoutes);
// app.use('/api/contact', contactRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Connect to MongoDB
// connectDB();

// // Basic route
// app.get("/", (req, res) => {
//   res.send("🚀 API is running...");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'حدث خطأ في الخادم',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Start server
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


require("dotenv").config(); //
const path = require("path");//

const express = require("express");//
const cors = require("cors");//
const connectDB = require("./config/db");  //
const jwt = require("jsonwebtoken");  
const cookiesParser = require("cookie-parser");//
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");

const authRoutes = require('./Routes/authRoutes');
const spaceRoutes = require('./Routes/spaceRoutes');
const screenRoutes = require('./Routes/screenRoutes');
const booking = require('./Routes/bookingRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');




const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: (_, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 




// Register Routes
app.use("/api/auth", authRoutes);  //
app.use("/api/users", userRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/bookings',booking );
app.use('/api/payments', paymentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Connect to MongoDB using connectDB function
connectDB();

// Routes




app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
