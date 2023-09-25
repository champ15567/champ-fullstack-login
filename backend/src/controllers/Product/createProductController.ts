import { Request, Response } from "express";
import Product, { IProduct } from "../../models/Product";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body as IProduct);
    res.json({
      status: "ok",
      message: "Product Created Successfully",
      product,
    });
  } catch (error: any) {
    if (error) {
      const validationErrors = Object?.keys(error?.errors).map(
        (key) => error?.errors[key].message
      );
      res.status(400).json({ status: "error", message: validationErrors });
    }
  }
};
