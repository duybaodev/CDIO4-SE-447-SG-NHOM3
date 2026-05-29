const express = require("express");

const router = express.Router();

// GET / - Lấy tất cả dữ liệu trạm
router.get("/", (req, res) => {
  res.json({ message: "Lấy tất cả dữ liệu trạm thành công" });
});

// POST /ingest - Nhận dữ liệu từ phần cứng IoT đổ về
router.post("/ingest", (req, res) => {
  res.json({
    message: "Nhận dữ liệu từ phần cứng IoT thành công",
    data: req.body,
  });
});

module.exports = router;
