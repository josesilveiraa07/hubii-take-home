import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { UpdateProductUseCase } from './update-product.usecase';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const updateProductDto: UpdateProductDto = {
      id: 'product-1',
      name: 'Updated Product 1',
      description: 'Updated Description',
      price: 150,
    };

    it('should throw RpcException with NotFoundException if product is not found', async () => {
      mockProductsRepository.update.mockResolvedValue(null);

      await expect(useCase.execute(updateProductDto)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsRepository.update).toHaveBeenCalledWith(
        updateProductDto.id,
        updateProductDto,
      );
    });

    it('should return the updated product if it exists', async () => {
      const mockProduct = new Product({
        id: updateProductDto.id,
        name: updateProductDto.name!,
        description: updateProductDto.description!,
        price: updateProductDto.price!,
        weight: 1,
        width: 10,
        height: 10,
        length: 10,
        stockAmount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockProductsRepository.update.mockResolvedValue(mockProduct);

      const result = await useCase.execute(updateProductDto);

      expect(mockProductsRepository.update).toHaveBeenCalledWith(
        updateProductDto.id,
        updateProductDto,
      );
      expect(result).toEqual(mockProduct);
    });
  });
});
