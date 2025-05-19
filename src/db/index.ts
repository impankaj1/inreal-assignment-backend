import mongoose from "mongoose";

const mongoose_url = process.env.MONGO_URI;

mongoose
  .connect(mongoose_url!)
  .then(() => {
    console.log("mongoose connected successfully");
  })
  .catch((err) => {
    console.log("mongoose connection error", err);
  });
