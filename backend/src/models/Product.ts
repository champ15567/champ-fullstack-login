import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  code: string;
  name: string;
  series: string;
  description: string;
  type: "computer" | "electrical appliance" | "accessories" | "other";
}

const ProductSchema = new Schema<IProduct>({
  code: {
    type: String,
    unique: true,
    required: [true, "Please provide code"],
    validate: {
      async validator(value: any) {
        try {
          const product = await mongoose
            .model("Product")
            .findOne({ code: value });
          return !product;
        } catch (error) {
          throw new Error("Code validation failed");
        }
      },
      message: "Code is already taken",
    },
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  description: {
    type: String,
    default: null,
  },
  series: {
    type: String,
    required: [true, "Please provide series"],
  },
  type: {
    type: String,
    enum: ["computer", "electrical appliance", "accessories", "other"],
    required: [true, "Please provide type"],
  },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
