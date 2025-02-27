import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database/database.module';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './repositories/products.repository';
import { CreateProductUseCase } from './usecases';

describe('ProductsController', () => {
  let productsController: ProductsController;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ProductsController],
      providers: [
        CreateProductUseCase,
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
  });
});
