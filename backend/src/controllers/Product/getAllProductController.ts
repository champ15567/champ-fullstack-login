import { Request, Response } from "express";
import Product, { IProduct } from "../../models/Product";

export default async (req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find(
      {},
      "code name description series  type"
    );

    if (products.length > 0) {
      res.json({
        status: "ok",
        message: "Products retrieved successfully",
        products: products,
      });
    } else {
      res.json({
        status: "ok",
        message: "No products found",
        products: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
