const router = require("express").Router();
const {
  getMyChats,
  getChatMessages,
  sendMessage,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/me", getMyChats);
router.get("/:id/messages", getChatMessages);
router.post("/:id/messages", sendMessage);

module.exports = router;
