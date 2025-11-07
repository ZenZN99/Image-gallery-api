import Image from "../models/Image";
import type { Request, Response } from "express";
import streamifier from "streamifier";
import multer from "multer";
import cloudinary from "cloudinary";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export async function getAllImage(req: Request, res: Response) {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    return res.status(200).json(images);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching images" });
  }
}

export async function uploadImage(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!req.file)
      return res.status(400).json({ error: "No image file provided" });
    if (!title || !description)
      return res
        .status(400)
        .json({ error: "Title and description are required" });

    const uploadToCloudinary = (): Promise<{
      secure_url: string;
      public_id: string;
    }> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "user_uploads" },
          (error, result) => {
            if (error) return reject(error);
            if (!result)
              return reject(new Error("No result returned from Cloudinary"));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        streamifier.createReadStream(req.file!.buffer).pipe(stream);
      });
    };

    const result = await uploadToCloudinary();

    const newImage = await Image.create({
      title,
      description,
      imageUrl: result.secure_url,
      userId: req.user._id,
      likes: 0,
      likedBy: [],
    });

    return res.status(201).json({
      success: "The image has been uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error while uploading image" });
  }
}

export async function updateImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ error: "Image ID is required" });
    }
    const { title, description } = req.body;

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!title || !description)
      return res
        .status(400)
        .json({ error: "Title and description are required" });

    const image = await Image.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, description },
      { new: true }
    );

    if (!image) return res.status(404).json({ error: "Image not found!" });

    return res
      .status(200)
      .json({ success: "The image has been modified successfully", image });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while editing the image." });
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ error: "Image ID is required" });
    }
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const image = await Image.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!image) return res.status(404).json({ error: "Image not found!" });

    return res
      .status(200)
      .json({ success: "The image has been successfully deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the image" });
  }
}

export async function imageMe(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const images = await Image.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(images);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching user photos" });
  }
}

export async function imageLike(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(401).json({ error: "Image ID is required" });
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.user._id;
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found!" });

    const hasLiked = image.likedBy.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (hasLiked) {
      image.likes = Math.max(0, image.likes - 1);
      image.likedBy = image.likedBy.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      image.likes += 1;
      image.likedBy.push(userId);
    }

    await image.save();

    return res.status(200).json({
      success: hasLiked ? "Like removed" : "The picture was liked",
      likes: image.likes,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while liking the photo" });
  }
}
