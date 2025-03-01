import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { AddToStockUseCase } from './add-to-stock.usecase';

describe('AddToStockUseCase', () => {
  let useCase: AddToStockUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddToStockUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<AddToStockUseCase>(AddToStockUseCase);
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

    it('should call incrementOrDecrementStock if input is valid and product exists', async () => {
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
      mockProductsRepository.incrementOrDecrementStock.mockResolvedValue({
        ...mockProduct,
        stockAmount: mockProduct.stockAmount + validInput,
      });

      const result = await useCase.execute(productId, validInput);

      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        mockProductsRepository.incrementOrDecrementStock,
      ).toHaveBeenCalledWith(productId, validInput);
      expect(result).toEqual({
        ...mockProduct,
        stockAmount: mockProduct.stockAmount + validInput,
      });
    });
  });
});
