import { ProductService } from '@/services/products.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Product } from '@interfaces/products.interface';

export class ProductController {
  public product = Container.get(ProductService);

  public addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = req.params.item;
      const { quantity, expiry } = req.body as { quantity: number; expiry: number };

      await this.product.createProduct({
        name: item,
        quantity,
        expiry,
      });

      // res.json({ data: result, message: 'product added' });
      res.json({});
    } catch (error) {
      next(error);
    }
  };

  public sellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = req.params.item;
      const { quantity } = req.body as { quantity: number };

      await this.product.sellProduct(item, quantity);

      // res.json({ data: result, message: 'product sold' });
      res.json({});
    } catch (error) {
      next(error);
    }
  };

  public getProductQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = req.params.item;

      const results: Array<Product> = await this.product.findAllProducts(item);

      let quantity = 0;
      let validTill = 0;

      for (const result of results) {
        quantity += Number(result.quantity);
        if (validTill === 0) {
          validTill = result.expiry;
        }
        if (validTill > result.expiry) {
          validTill = result.expiry;
        }
      }

      res.json({
        quantity: Number(quantity),
        validTill: validTill === 0 ? null : Number(validTill),
      });
    } catch (error) {
      next(error);
    }
  };
}
