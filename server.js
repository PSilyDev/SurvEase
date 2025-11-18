// server.js

// step 1 - create express app
const exp = require("express");
const app = exp();
const path = require("path");
require("dotenv").config();
require("./db"); // initializes the DB connection

// ✅ CORS (allow frontend from env + localhost)
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ JSON body parser (no need to call express.json twice)
app.use(exp.json({ limit: "1mb" }));

// --------------USER API--------------------------------
const userApp = require("./APIs/user-api");
app.use("/user-api", userApp);

// -------------------SURVEY API-------------------------
const surveyApp = require("./APIs/survey-api");
app.use("/survey-api", surveyApp);

// -------------------RESPONSE API------------------------
const responseApp = require("./APIs/response-api");
app.use("/response-api", responseApp);

// ✅ Health endpoint (handy for checking deploy status)
app.get("/health", (req, res) => res.json({ ok: true }));

// default error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send({ message: "Error occurred!", payload: err.message });
});

// step 7 - assign port number to the express app
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Web Server listening on port ${PORT}`));
