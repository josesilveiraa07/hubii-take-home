import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database/database.module';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './repositories/products.repository';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindProductsUseCase,
  FindProductUseCase,
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
      };

      const product = new Product({
        id: crypto.randomUUID(),
        description: input.description,
        name: input.name,
        price: input.price,
        stockAmount: input.stockAmount,
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
      });

      mockProductsRepository.findOneById.mockResolvedValue(product);

      const result = await productsController.findOneById(product.id);

      expect(result).toEqual(product);
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        product.id,
      );
    });

    it('should update a product', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
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

    it('should delete a product', async () => {
      const product = new Product({
        id: crypto.randomUUID(),
        description: 'Product description',
        name: 'Product name',
        price: 100.5,
        stockAmount: 50,
      });

      const result = await productsController.delete(product.id);

      expect(result).toEqual(undefined);
      expect(mockProductsRepository.delete).toHaveBeenCalled();
      expect(mockProductsRepository.delete).toHaveBeenCalledWith(product.id);
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        product.id,
      );
    });
  });
});
