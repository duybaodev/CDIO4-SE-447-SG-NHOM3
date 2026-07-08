//Quản lý điều phối & Nhật ký:
const Log = require("../models/Log");
const Ticket = require("../models/Ticket");

// Lấy nhật ký sửa chữa của KTV (Trang Logs)
const getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find({}).sort({ date: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách phiếu điều phối sửa chữa ưu tiên của Admin
const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

// Admin thay đổi độ ưu tiên điều phối phiếu sửa chữa
const updateTicketPriority = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { ticketId: id },
      { priority },
      { new: true }
    );
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs, getTickets, updateTicketPriority };
