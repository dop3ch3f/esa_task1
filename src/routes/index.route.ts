import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public index = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (_, res) => res.send('Server Online'));
    this.router.get(`${this.path}sync`, this.index.syncProducts);
  }
}
