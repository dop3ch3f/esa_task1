import { ProductService } from '@/services/products.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Product } from '@interfaces/products.interface';
import moment from 'moment';

export class ProductController {
  public product = Container.get(ProductService);

  public addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = req.params.item;
      const { quantity, expiry } = req.body as { quantity: number; expiry: number };

      const result: Product = await this.product.createProduct({
        name: item,
        quantity,
        expiry: new Date(expiry),
      });

      res.json({ data: result, message: 'product added' });
    } catch (error) {
      next(error);
    }
  };

  public sellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = req.params.item;
      const { quantity } = req.body as { quantity: number };

      const result: Product = await this.product.sellProduct(item, quantity);

      res.json({ data: result, message: 'product sold' });
    } catch (error) {
      next(error);
    }
  };

  public getProductQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = req.params.item;

      const result: Product = await this.product.findProduct(item);

      res.json({
        ...result,
        validTill: moment(result.expiry).millisecond(),
      });
    } catch (error) {
      next(error);
    }
  };
}
