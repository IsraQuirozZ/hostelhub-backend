const router = require("express").Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateFields = require("../middlewares/validateFields");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validators/post.validator");

// Públicas
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Privadas
router.post("/", authMiddleware, validateFields(createPostSchema), createPost);
router.put(
  "/:id",
  authMiddleware,
  validateFields(updatePostSchema),
  updatePost,
);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
