import { NextFunction, Request, Response } from "express";
import Product, { IProduct } from "../../models/Product";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code: string = req.params.code;

    if (!code) {
      return res
        .status(400)
        .json({ status: "error", message: "Code is required" });
    }

    const product: IProduct | null = await Product.findOne({ code: code });

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    const updateFields: Partial<IProduct> = {};

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "At least one field is required" });
    }

    if (req.body.name) {
      updateFields.name = req.body.name;
    }

    if (req.body.description) {
      updateFields.description = req.body.description;
    }

    if (req.body.series) {
      updateFields.series = req.body.series;
    }

    if (
      req.body.type &&
      (req.body.type === "computer" ||
        req.body.type === "electrical appliance" ||
        req.body.type === "accessories" ||
        req.body.type === "other")
    ) {
      updateFields.type = req.body.type;
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Type not correct" });
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        product._id,
        updateFields,
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        return res
          .status(500)
          .json({ status: "error", message: "Product update failed" });
      }

      res.json({
        status: "ok",
        message: "Product updated successfully",
        product: {
          code: updatedProduct.code,
          name: updatedProduct.name,
          description: updatedProduct.description,
          series: updatedProduct.series,
          type: updatedProduct.type,
        },
      });
    } catch (updateError) {
      console.error(updateError);
      return res
        .status(500)
        .json({ status: "error", message: "Product update failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
