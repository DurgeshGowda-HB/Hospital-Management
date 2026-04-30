import mongoose from "mongoose";
// it the library to define the schema

const userSchema = new mongoose.Schema( //defineing the structure to how data should be stored
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },

    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //recrods time
  }
);

const User = mongoose.model("User", userSchema); //creting the modelon user

export default User; //allow the file to use this model