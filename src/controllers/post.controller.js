const postService = require("../services/post.service");

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.json({ status: "success", data: posts });
  } catch (err) {
    next(err);
  }
};

const getPostsByCityId = async (req, res, next) => {
  try {
    const posts = await postService.getPostsByCityId(
      Number(req.params.id_ciudad),
    );
    res.json({ status: "success", data: posts });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(Number(req.params.id));
    res.json({ status: "success", data: post });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);
    res.status(201).json({ status: "success", data: post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(
      Number(req.params.id),
      req.user.id,
      req.body,
    );
    res.json({ status: "success", data: post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(Number(req.params.id), req.user.id);
    res.json({ status: "success", message: "Post eliminado" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPostsByCityId,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
