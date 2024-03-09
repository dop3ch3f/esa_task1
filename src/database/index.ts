import Sequelize from 'sequelize';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '@config';
import UserModel from '@models/users.model';
import ProductModel from '@models/products.model';

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: false,
  logging: false,
  benchmark: false,
});

sequelize
  .authenticate()
  .then(() => console.log('DB connected'))
  .catch(console.log);

export const DB = {
  Users: UserModel(sequelize),
  Products: ProductModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};
