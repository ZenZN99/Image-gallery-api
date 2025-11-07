import express from "express";
import {
  deleteImage,
  getAllImage,
  imageLike,
  imageMe,
  updateImage,
  upload,
  uploadImage,
} from "../controller/image.controller";
import { isAuthenticate } from "../middleware/isAuthenticate";

const imageRouter = express.Router();

imageRouter.get("/", getAllImage);

imageRouter.post(
  "/upload",
  isAuthenticate,
  upload.single("image"),
  uploadImage
);

imageRouter.put("/:id", isAuthenticate, updateImage);

imageRouter.delete("/:id", isAuthenticate, deleteImage);

imageRouter.get("/imageme", isAuthenticate, imageMe);

imageRouter.post("/:id/like", isAuthenticate, imageLike);

export default imageRouter;
