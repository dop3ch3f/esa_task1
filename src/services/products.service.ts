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
    await this.deleteExpiredProducts();
    const findProduct = await DB.Products.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    return findProduct.get();
  }

  public async findAllProducts(item: string): Promise<Array<Product>> {
    const products = await DB.Products.findAll({
      where: { name: { [Op.like]: item } },
      order: [['expiry', 'DESC']],
    });

    return products.map(p => p.get());
  }

  public async findProduct(item: string): Promise<Product> {
    const product = await DB.Products.findOne({
      where: { name: { [Op.like]: item } },
      order: [['expiry', 'DESC']],
    });

    if (!product) throw new HttpException(404, `This product is not found`);

    return product.get();
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const newProduct = await DB.Products.create(productData);

    return newProduct.get();
  }

  public async updateProduct(item: string, productData: Partial<Product>): Promise<Product> {
    const findProduct: Product = await this.findProduct(item);

    await DB.Products.update(productData, {
      where: {
        id: findProduct.id,
      },
    });

    const updatedProduct = await DB.Products.findByPk(findProduct.id);
    return updatedProduct.get();
  }

  public async updateProductById(id: number, productData: Partial<Product>): Promise<Product> {
    await DB.Products.update(productData, {
      where: {
        id: id,
      },
    });

    const updatedProduct = await DB.Products.findByPk(id);
    return updatedProduct.get();
  }

  public async deleteExpiredProducts(): Promise<void> {
    await DB.Products.destroy({
      where: {
        expiry: {
          [Op.lte]: new Date().getTime(),
        },
      },
    });
  }

  public async deleteProductById(id: number): Promise<void> {
    await DB.Products.destroy({
      where: {
        id,
      },
    });
  }

  public async deleteManyProducts(ids: number[]): Promise<void> {
    await DB.Products.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }

  public async sellProduct(item: string, quantity: number): Promise<void> {
    const t = await DB.sequelize.transaction();

    try {
      await this.deleteExpiredProducts();

      let products: Product[] = await this.findAllProducts(item);
      products = products.sort((a, b) => a.expiry - b.expiry);

      let remainingQuantity = quantity;
      const updatedProducts = [];

      for (const product of products) {
        const productQuantity = Number(product.quantity);
        const updatedProduct = { ...product };

        if (remainingQuantity >= productQuantity) {
          updatedProduct.quantity = 0;
          remainingQuantity -= productQuantity;
        } else {
          updatedProduct.quantity -= remainingQuantity;
          remainingQuantity = 0;
        }

        updatedProducts.push(updatedProduct);
      }

      const deleteIds = updatedProducts.filter(p => p.quantity === 0).map(p => p.id);
      await this.deleteManyProducts(deleteIds);

      // delete em ids
      const productsToUpdate = updatedProducts.filter(p => p.quantity !== 0);

      const productUpdatePromises = [];

      for (const product of productsToUpdate) {
        productUpdatePromises.push(this.updateProductById(product.id, product));
      }

      await Promise.all(productUpdatePromises);

      await t.commit();

      return;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
