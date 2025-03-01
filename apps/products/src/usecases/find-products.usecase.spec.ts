import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { FindProductsUseCase } from './find-products.usecase';

describe('FindProductsUseCase', () => {
  let useCase: FindProductsUseCase;
  const mockProductsRepository = createMock<ProductsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProductsUseCase,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindProductsUseCase>(FindProductsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of products and the total count', async () => {
      const mockProducts = [
        new Product({
          id: 'product-1',
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
        }),
        new Product({
          id: 'product-2',
          name: 'Product 2',
          description: 'Description of Product 2',
          price: 200,
          weight: 2,
          width: 20,
          height: 20,
          length: 20,
          stockAmount: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const mockCount = mockProducts.length;

      mockProductsRepository.findAll.mockResolvedValue(mockProducts);
      mockProductsRepository.count.mockResolvedValue(mockCount);

      const result = await useCase.execute();

      expect(mockProductsRepository.findAll).toHaveBeenCalled();
      expect(mockProductsRepository.count).toHaveBeenCalled();
      expect(result).toEqual({
        results: mockProducts,
        count: mockCount,
      });
    });
  });
});
