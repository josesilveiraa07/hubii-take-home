import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { SubtractFromStockDto } from '../dto/subtract-from-stock.dto';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { SubtractFromStockUseCase } from './subtract-from-stock.usecase';

describe('SubtractFromStockUseCase', () => {
  let useCase: SubtractFromStockUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubtractFromStockUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<SubtractFromStockUseCase>(SubtractFromStockUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const subtractFromStockDto: SubtractFromStockDto = {
      productId: 'product-1',
      amount: 5,
    };

    it('should throw RpcException if product is not found', async () => {
      mockProductsRepository.findOneById.mockResolvedValue(null);

      await expect(useCase.execute(subtractFromStockDto)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        subtractFromStockDto.productId,
      );
      expect(mockProductsRepository.subtractStock).not.toHaveBeenCalled();
    });

    it('should throw RpcException if there is not enough stock', async () => {
      const mockProduct = new Product({
        id: subtractFromStockDto.productId,
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

      await expect(useCase.execute(subtractFromStockDto)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        subtractFromStockDto.productId,
      );
      expect(mockProductsRepository.subtractStock).not.toHaveBeenCalled();
    });

    it('should subtract stock if product exists and there is enough stock', async () => {
      const mockProduct = new Product({
        id: subtractFromStockDto.productId,
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

      const updatedStockAmount =
        mockProduct.stockAmount - subtractFromStockDto.amount;

      mockProductsRepository.findOneById.mockResolvedValue(mockProduct);
      mockProductsRepository.subtractStock.mockResolvedValue({
        ...mockProduct,
        stockAmount: updatedStockAmount,
      });

      const result = await useCase.execute(subtractFromStockDto);

      expect(mockProductsRepository.findOneById).toHaveBeenCalledWith(
        subtractFromStockDto.productId,
      );
      expect(mockProductsRepository.subtractStock).toHaveBeenCalledWith(
        subtractFromStockDto,
      );
      expect(result).toEqual({
        ...mockProduct,
        stockAmount: updatedStockAmount,
      });
    });
  });
});
