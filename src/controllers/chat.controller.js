const chatService = require("../services/chat.service");

const getMyChats = async (req, res, next) => {
  try {
    const chats = await chatService.getMyChats(req.user.id);
    res.json({ status: "success", data: chats });
  } catch (err) {
    next(err);
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getChatMessages(
      Number(req.params.id),
      req.user.id,
    );
    res.json({ status: "success", data: messages });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const message = await chatService.sendMessage(
      Number(req.params.id),
      req.user.id,
      req.body.contenido,
    );
    res.status(201).json({ status: "success", data: message });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyChats, getChatMessages, sendMessage };
