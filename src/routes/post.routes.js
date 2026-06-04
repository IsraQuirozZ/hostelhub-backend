const router = require("express").Router();
const {
  getAllPosts,
  getPostsByCityId,
  getPostById,
  getMyPosts,
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

router.get("/", getAllPosts);
router.get("/me", authMiddleware, getMyPosts);
router.get("/city/:id_ciudad", getPostsByCityId);
router.get("/:id", getPostById);
router.post("/", authMiddleware, validateFields(createPostSchema), createPost);
router.put(
  "/:id",
  authMiddleware,
  validateFields(updatePostSchema),
  updatePost,
);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
