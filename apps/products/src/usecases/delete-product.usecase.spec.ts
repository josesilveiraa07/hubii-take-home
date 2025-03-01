import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { DeleteProductUseCase } from './delete-product.usecase';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
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
      expect(mockProductsRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete the product if it exists', async () => {
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
      mockProductsRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(productId);

      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
      expect(mockProductsRepository.delete).toHaveBeenCalledWith(productId);
    });
  });
});
