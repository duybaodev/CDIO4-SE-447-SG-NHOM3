const express = require("express");
const router = express.Router();

// Code mồi giữ chỗ chống crash hệ thống
router.get("/test", (req, res) => {
  res.send("Thông mạch thiết bị và lịch sử hệ thống thành công!");
});

module.exports = router;
