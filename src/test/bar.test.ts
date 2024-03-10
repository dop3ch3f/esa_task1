import { IndexRoute } from '@routes/index.route';
import App from '@/app';
import request from 'supertest';
import { DB } from '@database';

beforeAll(async () => {
  await DB.sequelize.drop();
  await DB.sequelize.sync({ force: true }).catch(console.debug);
});

describe('item=bar:', () => {
  // we set the new timeout value so that test doesn't err out
  jest.setTimeout(200000);

  const t0 = new Date().getTime();

  it('t=t0, POST /bar/add, IN: {expiry: t0+10000, quantity: 10}, OUT: {}', async () => {
    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);
    const response = await request(app.getServer())
      .post(`${indexRoute.path}/bar/add`)
      .send({
        quantity: 10,
        expiry: t0 + 10000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+1000, POST /bar/add, IN: {expiry: t0+15000, quantity: 10}, OUT: {}', async () => {
    // delay by 1000 to get 1000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);
    const response = await request(app.getServer())
      .post(`${indexRoute.path}/bar/add`)
      .send({
        quantity: 10,
        expiry: t0 + 15000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+2000, POST /bar/add, IN: {expiry: t0+20000, quantity: 10}, OUT: {}', async () => {
    // delay by 1000 to get 2000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);
    const response = await request(app.getServer())
      .post(`${indexRoute.path}/bar/add`)
      .send({
        quantity: 10,
        expiry: t0 + 20000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+3000, GET /bar/quantity, IN: {}, OUT: {quantity: 30, validTill: t0+10000}', async () => {
    // delay by 1000 to get  3000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/bar/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 30,
      validTill: t0 + 10000,
    });
  });

  it('t=t0+5000, POST /bar/sell, IN: {quantity: 5}, OUT: {}', async () => {
    // delay by 2000 to get  5000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).post(`${indexRoute.path}/bar/sell`).send({
      quantity: 5,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+7000, GET /bar/quantity, IN: {}, OUT: {quantity: 25, validTill: t0+10000}', async () => {
    // delay by 2000 to get  7000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/bar/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 25,
      validTill: t0 + 10000,
    });
  });

  it('t=t0+10000, GET /bar/quantity, IN: {}, OUT: {quantity: 20, validTill: t0+15000}', async () => {
    // delay by 3000 to get  10000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/bar/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 20,
      validTill: t0 + 15000,
    });
  });

  it('t=t0+13000, POST /bar/sell, IN: {quantity: 13}, OUT: {}', async () => {
    // delay by 3000 to get  13000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).post(`${indexRoute.path}/bar/sell`).send({
      quantity: 13,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('t=t0+14000, GET /bar/quantity, IN: {}, OUT: {quantity: 7, validTill: t0+20000}', async () => {
    // delay by 1000 to get  14000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/bar/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 7,
      validTill: t0 + 20000,
    });
  });

  it('t=t0+17000, GET /bar/quantity, IN: {}, OUT: {quantity: 7, validTill: t0+20000}', async () => {
    // delay by 3000 to get  17000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/bar/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 7,
      validTill: t0 + 20000,
    });
  });

  it('t=t0+20000, GET /bar/quantity, IN: {}, OUT: {quantity: 0, validTill: null}', async () => {
    // delay by 3000 to get  20000
    await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    const response = await request(app.getServer()).get(`${indexRoute.path}/bar/quantity`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quantity: 0,
      validTill: null,
    });
  });
});

// describe('Testing for foo', () => {});
