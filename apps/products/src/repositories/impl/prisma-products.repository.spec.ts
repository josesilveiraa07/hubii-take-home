import { PrismaDatabaseProvider } from '@app/database/providers/prisma-database.provider';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../../dto/create-product.dto';
import { SubtractFromStockDto } from '../../dto/subtract-from-stock.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { Product } from '../../entities/product.entity';
import { PrismaProductsRepository } from './prisma-products.repository';

describe('PrismaProductsRepository', () => {
  let repository: PrismaProductsRepository;
  const mockPrisma = createMock<PrismaDatabaseProvider>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductsRepository,
        {
          provide: PrismaDatabaseProvider,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaProductsRepository>(PrismaProductsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a product with the correct data', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        stockAmount: 10,
        height: 10,
        length: 10,
        weight: 1,
        width: 10,
      };

      const mockProduct: Product = {
        id: 'product-1',
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.product.create = jest.fn().mockResolvedValue(mockProduct);

      const result = await repository.create(createProductDto);

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          stockAmount: createProductDto.stockAmount,
          height: createProductDto.height,
          length: createProductDto.length,
          weight: createProductDto.weight,
          width: createProductDto.width,
        },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts: Product[] = [
        {
          id: 'product-1',
          name: 'Product 1',
          description: 'Description of Product 1',
          price: 100,
          stockAmount: 10,
          height: 10,
          length: 10,
          weight: 1,
          width: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.product.findMany = jest.fn().mockResolvedValue(mockProducts);

      const result = await repository.findAll();

      expect(mockPrisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOneById', () => {
    it('should find a product by id', async () => {
      const productId = 'product-1';
      const mockProduct: Product = {
        id: productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        stockAmount: 10,
        height: 10,
        length: 10,
        weight: 1,
        width: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.product.findUnique = jest.fn().mockResolvedValue(mockProduct);

      const result = await repository.findOneById(productId);

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if the product is not found', async () => {
      const productId = 'product-1';

      mockPrisma.product.findUnique = jest.fn().mockResolvedValue(null);

      const result = await repository.findOneById(productId);

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a product with the correct data', async () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        id: productId,
        name: 'Updated Product 1',
        description: 'Updated Description',
        price: 150,
        stockAmount: 20,
      };

      const mockProduct: Product = {
        id: productId,
        name: updateProductDto.name!,
        description: updateProductDto.description!,
        price: updateProductDto.price!,
        stockAmount: updateProductDto.stockAmount!,
        height: 10,
        length: 10,
        weight: 1,
        width: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.product.update = jest.fn().mockResolvedValue(mockProduct);

      const result = await repository.update(productId, updateProductDto);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          stockAmount: updateProductDto.stockAmount,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if the product is not found', async () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        id: productId,
        name: 'Updated Product 1',
        description: 'Updated Description',
        price: 150,
        stockAmount: 20,
      };

      mockPrisma.product.update = jest.fn().mockResolvedValue(null);

      const result = await repository.update(productId, updateProductDto);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          stockAmount: updateProductDto.stockAmount,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      const productId = 'product-1';

      mockPrisma.product.delete = jest.fn().mockResolvedValue({} as Product);

      await repository.delete(productId);

      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe('subtractStock', () => {
    it('should subtract stock from a product', async () => {
      const subtractFromStockDto: SubtractFromStockDto = {
        productId: 'product-1',
        amount: 5,
      };

      const mockProduct: Product = {
        id: subtractFromStockDto.productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        stockAmount: 5, // Estoque reduzido
        height: 10,
        length: 10,
        weight: 1,
        width: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.product.update = jest.fn().mockResolvedValue(mockProduct);

      const result = await repository.subtractStock(subtractFromStockDto);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: subtractFromStockDto.productId },
        data: {
          stockAmount: {
            increment: -subtractFromStockDto.amount,
          },
        },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('incrementOrDecrementStock', () => {
    it('should increment or decrement stock of a product', async () => {
      const productId = 'product-1';
      const quantity = 10;

      const mockProduct: Product = {
        id: productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        stockAmount: 20, // Estoque atualizado
        height: 10,
        length: 10,
        weight: 1,
        width: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.product.update = jest.fn().mockResolvedValue(mockProduct);

      const result = await repository.incrementOrDecrementStock(
        productId,
        quantity,
      );

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          stockAmount: {
            increment: quantity,
          },
        },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('count', () => {
    it('should return the total count of products', async () => {
      const mockCount = 10;

      mockPrisma.product.count = jest.fn().mockResolvedValue(mockCount);

      const result = await repository.count();

      expect(mockPrisma.product.count).toHaveBeenCalled();
      expect(result).toEqual(mockCount);
    });
  });
});
