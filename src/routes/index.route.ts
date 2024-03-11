import { IndexController } from '@controllers/index.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class IndexRoute implements Routes {
  public path = '';
  public router = Router();
  public index = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:item/add`, this.index.addProduct);
    this.router.post(`${this.path}/:item/sell`, this.index.sellProduct);
    this.router.get(`${this.path}/:item/quantity`, this.index.getProductQuantity);
    this.router.get(this.path, (req, res, next) => {
      res.send('Server online');
      next();
    });
  }
}
