import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { RemoveFromStockUseCase } from './remove-from-stock.usecase';

describe('RemoveFromStockUseCase', () => {
  let useCase: RemoveFromStockUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveFromStockUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<RemoveFromStockUseCase>(RemoveFromStockUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const productId = 'product-1';
    const validInput = 5;
    const invalidInput = 0;

    it('should throw RpcException if input is less than 1', async () => {
      await expect(useCase.execute(productId, invalidInput)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsRepository.findOneById).not.toHaveBeenCalled();
      expect(
        mockProductsRepository.incrementOrDecrementStock,
      ).not.toHaveBeenCalled();
    });

    it('should throw RpcException if product is not found', async () => {
      mockProductsRepository.findOneById.mockResolvedValue(null);

      await expect(useCase.execute(productId, validInput)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        mockProductsRepository.incrementOrDecrementStock,
      ).not.toHaveBeenCalled();
    });

    it('should throw RpcException if there is not enough stock', async () => {
      const mockProduct = new Product({
        id: productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        weight: 1,
        width: 10,
        height: 10,
        length: 10,
        stockAmount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockProductsRepository.findOneById.mockResolvedValue(mockProduct);

      await expect(useCase.execute(productId, validInput)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        mockProductsRepository.incrementOrDecrementStock,
      ).not.toHaveBeenCalled();
    });

    it('should decrement stock if input is valid and there is enough stock', async () => {
      const mockProduct = new Product({
        id: productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        weight: 1,
        width: 10,
        height: 10,
        length: 10,
        stockAmount: 10, // Estoque suficiente
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updatedStockAmount = mockProduct.stockAmount - validInput;

      mockProductsRepository.findOneById.mockResolvedValue(mockProduct);
      mockProductsRepository.incrementOrDecrementStock.mockResolvedValue({
        ...mockProduct,
        stockAmount: updatedStockAmount,
      });

      const result = await useCase.execute(productId, validInput);

      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        mockProductsRepository.incrementOrDecrementStock,
      ).toHaveBeenCalledWith(productId, -validInput);
      expect(result).toEqual({
        ...mockProduct,
        stockAmount: updatedStockAmount,
      });
    });
  });
});
