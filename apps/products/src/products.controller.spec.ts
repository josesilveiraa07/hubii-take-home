import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'libs/common/database/database.module';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './repositories/products.repository';
import {
  AddToStockUseCase,
  CreateProductUseCase,
  DeleteProductUseCase,
  FindProductsUseCase,
  FindProductUseCase,
  RemoveFromStockUseCase,
  SubtractFromStockUseCase,
} from './usecases';
import { UpdateProductUseCase } from './usecases/update-product.usecase';

describe('ProductsController', () => {
  let productsController: ProductsController;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ProductsController],
      providers: [
        CreateProductUseCase,
        FindProductsUseCase,
        FindProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
        SubtractFromStockUseCase,
        AddToStockUseCase,
        RemoveFromStockUseCase,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    productsController = app.get<ProductsController>(ProductsController);
  });

  describe('ProductsController', () => {
    it('should create a product', async () => {
      const input: CreateProductDto = {
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      };

      const product = new Product({
        id: crypto.randomUUID(),
        description: input.description,
        name: input.name,
        price: input.price,
        stockAmount: input.stockAmount,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      mockProductsRepository.create.mockResolvedValue(product);

      const result = await productsController.create(input);

      expect(result).toEqual(product);
      expect(mockProductsRepository.create).toHaveBeenCalledWith(input);
      expect(result.description).toEqual(input.description);
      expect(result.stockAmount).toEqual(input.stockAmount);
    });

    it('should find all products', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      const products = [product];

      mockProductsRepository.findAll.mockResolvedValue(products);
      mockProductsRepository.count.mockResolvedValue(products.length);

      const data = await productsController.findAll();

      expect(data.results).toEqual(products);
      expect(data.count).toEqual(products.length);
      expect(mockProductsRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockProductsRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should find a product by id', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      mockProductsRepository.findOneById.mockResolvedValue(product);

      const result = await productsController.findOneById(product.id);

      expect(result).toEqual(product);
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        product.id,
      );
    });

    it('should throw if the product is not found', async () => {
      const id = crypto.randomUUID();

      mockProductsRepository.findOneById.mockResolvedValueOnce(null);

      await expect(productsController.findOneById(id)).rejects.toThrow();
    });

    it('should update a product', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      const input = {
        description: 'Product description updated',
        name: 'Product name updated',
        price: 150.5,
        stockAmount: 60,
      };

      const updatedProduct = new Product({
        id: product.id,
        description: input.description,
        name: input.name,
        price: input.price,
        stockAmount: input.stockAmount,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      mockProductsRepository.update.mockResolvedValue(updatedProduct);

      const result = await productsController.update({
        ...input,
        id: product.id,
      });

      expect(result).toEqual(updatedProduct);
      expect(mockProductsRepository.update).toHaveBeenCalledWith(product.id, {
        ...input,
        id: product.id,
      });
      expect(result.description).toEqual(input.description);
      expect(result.stockAmount).toEqual(input.stockAmount);
    });

    it('should not update a non-existing product', async () => {
      const input = {
        description: 'Product description updated',
        name: 'Product name updated',
        price: 150.5,
        stockAmount: 60,
      };

      mockProductsRepository.update.mockResolvedValueOnce(null);

      await expect(
        productsController.update({
          ...input,
          id: crypto.randomUUID(),
        }),
      ).rejects.toThrow();
    });

    it('should delete a product', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      const result = await productsController.delete(product.id);

      expect(result).toEqual(undefined);
      expect(mockProductsRepository.delete).toHaveBeenCalled();
      expect(mockProductsRepository.delete).toHaveBeenCalledWith(product.id);
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        product.id,
      );
    });

    it('should subtract from stock amount', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      const quantity = 10;

      const updatedProduct = new Product({
        id: product.id,
        description: product.description,
        name: product.name,
        price: product.price,
        stockAmount: product.stockAmount - quantity,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      mockProductsRepository.subtractStock.mockResolvedValue(updatedProduct);

      const result = await productsController.subtractStock({
        productId: product.id,
        amount: quantity,
      });

      expect(result).toEqual(updatedProduct);
      expect(mockProductsRepository.subtractStock).toHaveBeenCalledWith({
        productId: product.id,
        amount: quantity,
      });
    });

    it('should not subtract if stock amount is less than quantity', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      const quantity = 60;

      const updatedProduct = new Product({
        id: product.id,
        description: product.description,
        name: product.name,
        price: product.price,
        stockAmount: product.stockAmount - quantity,
        width: 10,
        height: 10,
        length: 10,
        weight: 10,
      });

      mockProductsRepository.subtractStock.mockResolvedValue(updatedProduct);

      await expect(
        productsController.subtractStock({
          productId: product.id,
          amount: quantity,
        }),
      ).rejects.toThrow();
    });
  });
});
