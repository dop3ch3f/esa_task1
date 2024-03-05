import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Product } from '@interfaces/products.interface';

export type ProductCreationAttributes = Optional<Product, 'name' | 'quantity' | 'expiry'>;

export class ProductModel extends Model<Product, ProductCreationAttributes> implements Product {
  id: number;
  name: string;
  quantity: number;
  expiry: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ProductModel {
  ProductModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.BIGINT,
      },
      expiry: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'products',
      sequelize,
    },
  );

  return ProductModel;
}
