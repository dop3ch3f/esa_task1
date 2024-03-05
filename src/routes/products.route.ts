import { ProductController } from '@/controllers/products.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class ProductRoute implements Routes {
  public path = '/products';
  public router = Router();
  public product = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:item/add`, this.product.addProduct);
    this.router.post(`${this.path}/:item/sell`, this.product.sellProduct);
    this.router.get(`${this.path}/:item/quantity`, this.product.getProductQuantity);
  }
}
