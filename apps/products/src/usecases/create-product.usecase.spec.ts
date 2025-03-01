import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { CreateProductUseCase } from './create-product.usecase';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        weight: 1,
        width: 10,
        height: 10,
        length: 10,
        stockAmount: 10,
      };

      const mockProduct = new Product({
        id: 'product-1',
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockProductsRepository.create.mockResolvedValue(mockProduct);

      const result = await useCase.execute(createProductDto);

      expect(mockProductsRepository.create).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(result).toEqual(mockProduct);
    });
  });
});
