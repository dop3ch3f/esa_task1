import { ProductRoute } from '@routes/products.route';
import { Sequelize } from 'sequelize';
import { App } from '@/app';
import request from 'supertest';
import { CreateProductDto } from '@dtos/products.dto';
import { Product } from '@interfaces/products.interface';
import moment from 'moment';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Products', () => {
  describe('[POST] /:item/add', () => {
    it('Adds an item to lot', async () => {
      const productsRoute = new ProductRoute();
      const products = productsRoute.product.product.products;
      const tempDB: Array<Product> = [];
      const testData: CreateProductDto = {
        name: 'Lot1',
        quantity: 300000,
        expiry: moment().add(30, 'days').toDate(),
      };

      // Mock db
      products.create = jest.fn(data => {
        tempDB.push(data.data);
        return data.data;
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([productsRoute]);
      const response = await request(app.getServer()).post(`${productsRoute.path}/${testData.name}/add`).send(testData);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual(tempDB[0]);
    });
  });

  describe('POST /:item/sell', () => {
    it('Sells an item out of the lot', async () => {
      const productsRoute = new ProductRoute();
      const products = productsRoute.product.product.products;
      const tempDB: Array<Product> = [];
    });
  });

  // describe('GET /:item/quantity', () => {});
});
