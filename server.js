const express = require("express"); 
const cors = require("cors"); 
const cookieParser = require("cookie-parser"); 
const session = require("express-session"); 
const passport = require("passport"); 
const dotenv = require("dotenv"); 
const path = require("path"); 
const db = require("./config/Db"); 
const redisClient = require("./config/RedisClient"); 
const User = require("./Models/GoogleUser"); 
const Routes = require("./Routes"); 
require("./config/auth"); // Import Google OAuth setup

dotenv.config(); // Load environment variables from .env file

const app = express(); 
const port = process.env.PORT || 3001;

app.set("trust proxy", true); // Trust proxy headers (useful when behind a proxy like Nginx)

// Middleware
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: process.env.ORIGIN, // Allow requests from frontend
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve Static Files (for HTML pages)
app.use(express.static(path.join(__dirname, "HtmlPages"))); 

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for session encryption
    resave: false, // Avoid resaving session if not modified
    saveUninitialized: true, // Save uninitialized sessions
  })
);

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Enable session-based authentication

app.use("/", Routes); // Use the main route handler

// ✅ Google OAuth Login Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }) // Request Google profile and email access
);

// ✅ Google OAuth Callback Route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/404" }), // Redirect to 404 if login fails
  async (req, res) => {
    if (!req.user) {
      return res.redirect("/404"); // Redirect if user data is missing
    }

    // Store JWT in HttpOnly Cookie for security
    res.cookie("token", req.user.accessToken, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 3600000, // Cookie expires in 1 hour
    });

    // Check if user exists in DB, if not, create a new user
    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user) {
      let newUser = new User({
        googleId: req.user.googleId,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        accessToken: req.user.accessToken,
      });

      newUser.save(); // Save user to database
    }

    // ✅ Send user details as a JSON response
    res.json({
      message: "Login successful",
      user: req.user, // Send authenticated user data
    });
  }
);

// ✅ Route for Success Page
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "HtmlPages", "success.html")); // Serve success page
});

// ✅ Route for 404 Page
app.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, "HtmlPages", "404.html")); // Serve 404 error page
});

// ✅ Catch-All for Unknown Routes (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "HtmlPages", "404.html")); // Handle unknown routes
});

// ✅ Logout Route
app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Remove authentication cookie
  req.logout(() => {
    res.redirect("/"); // Redirect to home page after logout
  });
});


// Start Server
const startServer = async () => {
  try {
    await db(); // Connect to the database
    await redisClient.connect(); // Connect to Redis
    console.log("Connected to Redis");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); // Start Express server
    });
  } catch (err) {
    console.error("Error starting server:", err.message); // Handle startup errors
  }
};

startServer(); // Invoke the server start function
