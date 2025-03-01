import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { FindProductUseCase } from './find-product.usecase';

describe('FindProductUseCase', () => {
  let useCase: FindProductUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProductUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindProductUseCase>(FindProductUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const productId = 'product-1';

    it('should throw RpcException with NotFoundException if product is not found', async () => {
      mockProductsRepository.findOneById.mockResolvedValue(null);

      await expect(useCase.execute(productId)).rejects.toThrow(RpcException);
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
    });

    it('should return the product if it exists', async () => {
      const mockProduct = new Product({
        id: productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        weight: 1,
        width: 10,
        height: 10,
        length: 10,
        stockAmount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockProductsRepository.findOneById.mockResolvedValue(mockProduct);

      const result = await useCase.execute(productId);

      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
      expect(result).toEqual(mockProduct);
    });
  });
});
