import { IndexRoute } from '@routes/index.route';
import App from '@/app';
import request from 'supertest';
import { DB } from '@database';

beforeAll(async () => {
  await DB.sequelize.drop();
  await DB.sequelize.sync({ force: true }).catch(console.debug);
});

describe('item=foo:', () => {
  // we set the new timeout value so that test doesn't err out
  jest.setTimeout(200000);

  const t0 = new Date().getTime();
  it('t=t0, POST /foo/add, IN: {expiry: t0+10000, quantity: 10}, OUT: {}', async () => {
    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);
    const response = await request(app.getServer())
      .post(`${indexRoute.path}/foo/add`)
      .send({
        quantity: 10,
        expiry: t0 + 10000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+5000, GET /foo/quantity, IN: {}, OUT: {quantity: 10, validTill: t0+10000}', async () => {
    // delay by 5000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 5000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);
    const response = await request(app.getServer()).get(`${indexRoute.path}/foo/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 10,
      validTill: t0 + 10000,
    });
  });

  it('t=t0+7000, POST /foo/add, IN: {expiry: t0+20000, quantity: 5}, OUT: {}', async () => {
    // delay by 2000 to get 7000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer())
      .post(`${indexRoute.path}/foo/add`)
      .send({
        quantity: 5,
        expiry: t0 + 20000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+8000, GET /foo/quantity, IN: {}, OUT: {quantity: 15, validTill: t0+10000}', async () => {
    // delay by 1000 to get  8000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/foo/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 15,
      validTill: t0 + 10000,
    });
  });

  it('t=t0+10000, GET /foo/quantity, IN: {}, OUT: {quantity: 5, validTill: t0+20000}', async () => {
    // delay by 2000 to get  10000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/foo/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 5,
      validTill: t0 + 20000,
    });
  });

  it('t=t0+12000, POST /foo/sell, IN: {quantity: 3}, OUT: {}', async () => {
    // delay by 2000 to get  12000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).post(`${indexRoute.path}/foo/sell`).send({
      quantity: 3,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+13000, GET /foo/quantity, IN: {}, OUT: {quantity: 2, validTill: t0+20000}', async () => {
    // delay by 1000 to get  13000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/foo/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 2,
      validTill: t0 + 20000,
    });
  });

  it('t=t0+20000, GET /foo/quantity, IN: {}, OUT: {quantity: 0, validTill: null}', async () => {
    // delay by 7000 to get  20000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 7000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/foo/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 0,
      validTill: null,
    });
  });
});
