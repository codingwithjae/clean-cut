const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "This is the shorten page",
  });
});

module.exports = router;
