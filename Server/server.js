require("dotenv").config(); 
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");  
const cookiesParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");

const authRoutes = require('./Routes/authRoutes');
const spaceRoutes = require('./Routes/spaceRoutes');
const screenRoutes = require('./Routes/screenRoutes');
const contactRoutes = require('./Routes/contactRouter');
const booking = require('./Routes/bookingRoutes');
const searchRoutes = require('./Routes/searchRoutes');
const heroRoutes = require('./Routes/heroRoute');
const statsRouter = require('./Routes/statsRouter');



const app = express();
const PORT = process.env.PORT || 5000;

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




// Routes
app.use("/api/auth", authRoutes);  
app.use("/api/users", userRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/bookings',booking );
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/contacts', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/v1/stats', statsRouter);




connectDB();





app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
