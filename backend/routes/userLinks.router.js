const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "All your links are here",
  });
});

module.exports = router;
