import { Request, Response } from "express";
import Product, { IProduct } from "../../models/Product";

export default async (req: Request, res: Response) => {
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

    res.json({
      status: "ok",
      message: "Get product success",
      product: {
        code: product.code,
        name: product.name,
        description: product.description,
        series: product.series,
        type: product.type,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
