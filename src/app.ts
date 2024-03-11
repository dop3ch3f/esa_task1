import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { CREDENTIALS, NODE_ENV, ORIGIN, PORT } from '@config';
import { DB } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger } from '@utils/logger';
import chalk from 'chalk';
import { ProductService } from '@services/products.service';
import cron from 'node-cron';

import cluster from 'node:cluster';

import process from 'node:process';

export default class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public task: cron.ScheduledTask;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeCron();
  }

  public listen() {
    if (!Boolean(this.env === 'testing') && cluster.isPrimary) {
      console.log(`Primary ${process.pid} is running`);

      // Fork workers.
      for (let i = 0; i < 3; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      // Workers can share any TCP connection
      // In this case it is an HTTP server
      this.app.listen(this.port, () => {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`🚀 App listening on the port ${this.port}`);
        logger.info(`=================================`);
      });

      console.log(`Worker ${process.pid} started`);
    }
  }

  public getServer() {
    return this.app;
  }

  public stopCron() {
    this.task.stop();
  }

  private async connectToDatabase() {
    await DB.sequelize
      .sync({ force: false })
      .then(() => console.log('synced'))
      .catch(console.debug);
  }

  private initializeMiddlewares() {
    morgan.token('body', (req: Request) => JSON.stringify(req.body));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      morgan(`${chalk.green('[Http]')} ${chalk.yellow(':method')} ${chalk.blue(':url')} :response-time ms :body ${chalk.red.bold(':status')}`),
    );
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private initializeCron() {
    this.task = cron.schedule('* * * * * *', async () => {
      // console.log('running every second');
      const product = new ProductService();
      await product.deleteExpiredProducts();
    });
    // for millisecond control
    // setInterval(async () => {
    //   const product = new ProductService();
    //   await product.deleteExpiredProducts();
    // }, 1000);
  }
}
