const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

app.use(cors());

// Middleware to handle language detection and loading translations
app.use((req, res, next) => {
  let language = req.query.language;

  // Map full language names to language codes/json files
  const languageMap = {
    English: "en",
    French: "fr",
    Hindi: "hi",
  };

  // Convert full language name to corresponding language file
  const languageFile = languageMap[language];

  // If the language is not supported, return error in English
  if (!languageFile) {
    console.log("The requested language is not supported");
    return res
      .status(400)
      .json({ Error_Message: "The requested language is not supported" });
  }

  // Proceed to find the translation file for supported languages
  const langFilePath = path.join(
    __dirname,
    `translations/${languageFile}.json`
  );

  // Check if the translation file exists, otherwise return error
  if (!fs.existsSync(langFilePath)) {
    console.log("The requested language is not supported");
    return res
      .status(400)
      .json({ Error_Message: "The requested language is not supported" });
  }

  // Load the translation file
  req.translations = require(langFilePath);
  next();
});

// API Route for /hello
app.get("/hello", (req, res) => {
  const { msgText } = req.translations;

  if (!msgText) {
    console.log("msgText is undefined in the translation file.");
    return res
      .status(400)
      .json({ Error_Message: "msgText is undefined in the translation file." });
  }
  console.log("msgText:", msgText);

  // Directly return the translated message (msgText) as a plain string
  res.status(200).send(msgText);

  // Log the message separately after sending the JSON response
  console.log("Message Get Successful to the required language");
});

// Middleware for 404 errors
app.use((req, res, next) => {
  console.log("Resource Not Found");
  res.status(404).json({
    Error_Message: "Resource not found",
  });
});

// Error handler for unsupported languages or internal server errors
app.use((err, req, res, next) => {
  console.log("Internal Serve Error", err);
  res.status(500).json({
    Error_Message: "Internal Server Error",
  });
});

// Start the server
app.listen(5000, () => {
  console.log("API is running on http://localhost:5000");
});

