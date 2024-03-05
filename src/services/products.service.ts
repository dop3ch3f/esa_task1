import { Service } from 'typedi';
import { DB } from '@database';
import { Product } from '@interfaces/products.interface';
import { HttpException } from '@/exceptions/HttpException';
import { CreateProductDto } from '@/dtos/products.dto';
import { Op } from 'sequelize';

@Service()
export class ProductService {
  products = DB.Products;

  public async findProductById(productId: number): Promise<Product> {
    const findProduct: Product = await DB.Products.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "User doesn't exist");

    return findProduct;
  }

  public async findProduct(item: string): Promise<Product> {
    await this.deleteExpiredProducts();

    const product: Product = await DB.Products.findOne({ where: { name: item } });

    if (!product) throw new HttpException(404, `This product is not found`);

    return product;
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const findProduct: Product = await DB.Products.findOne({ where: { name: productData.name } });

    if (findProduct) throw new HttpException(409, `This product already exists`);

    const newProduct: Product = await DB.Products.create(productData);

    return newProduct;
  }

  public async updateProduct(item: string, productData: Partial<Product>): Promise<Product> {
    const findProduct: Product = await this.findProduct(item);

    await DB.Products.update(productData, {
      where: {
        id: findProduct.id,
      },
    });

    const updatedProduct: Product = await DB.Products.findByPk(findProduct.id);
    return updatedProduct;
  }

  public async deleteExpiredProducts(): Promise<void> {
    await DB.Products.destroy({
      where: {
        expiry: {
          [Op.lte]: new Date(),
        },
      },
    });
  }

  public async sellProduct(item: string, quantity: number): Promise<Product> {
    const t = await DB.sequelize.transaction();

    // we delete expired records so we are working with available products
    await this.deleteExpiredProducts();

    try {
      const product = await this.findProduct(item);

      if (product.quantity < quantity) throw new HttpException(400, `quantity is more than available ${product.quantity}`);

      await this.updateProduct(item, { quantity: product.quantity - quantity });

      await t.commit();

      return this.findProductById(product.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
