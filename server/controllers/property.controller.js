import mongoose from "mongoose";
import User from "../mongoDb/models/user.js";
import Property from "../mongoDb/models/property.js";

import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  const query = {};

  if (propertyType !== "") {
    query.propertyType = propertyType;
  }

  if (title_like) {
    query.title = { $regex: title_like, $options: "i" };
  }

  try {
    const count = await Property.countDocuments({ query });
    const properties = await Property.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id,
    });
    user.allProperties.push(newProperty._id);

    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Property successfully created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Property.findOne({ _id: id }).populate(
    "creator"
  );

  if (!propertyExists) {
    res.status(404).json({ message: "Property not found" });
  }

  res.status(200).json(propertyExists);
};

const updateProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { title, description, propertyType, location, price, photo } =
      req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    const propertyToUpdate = await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );
    res.status(200).json({ message: "Property successfully updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    const propertyToDelete = await Property.findByIdAndDelete({
      _id: id,
    }).populate("creator");

    // propertyToDelete.remove({ session });
    // propertyToDelete.creator?.allProperties?.pull(propertyToDelete);

    // await propertyToDelete.creator.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Property successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createProperty,
  getAllProperties,
  getPropertyDetail,
  deleteProperty,
  updateProperty,
};
