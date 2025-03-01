import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { UpdateProductDto } from 'apps/products/src/dto/update-product.dto';
import { Product } from 'apps/products/src/entities/product.entity';
import { firstValueFrom, of } from 'rxjs';
import { AddStockDto } from './dto/add-stock.dto';
import { FindProductsResponseDto } from './dto/find-products-response.dto';
import { RemoveFromStockDto } from './dto/remove-from-stock.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockProductsService = createMock<ProductsService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call productsService.create with the correct data and return the created product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        stockAmount: 10,
        width: 10,
        height: 10,
        length: 10,
        weight: 1,
      };

      const mockProduct: Product = {
        id: 'product-1',
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.create.mockReturnValue(of(mockProduct));

      const result = await firstValueFrom(controller.create(createProductDto));

      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should call productsService.findAll and return the list of products', async () => {
      const mockProducts: Product[] = [
        {
          id: 'product-1',
          name: 'Product 1',
          description: 'Description of Product 1',
          price: 100,
          stockAmount: 10,
          width: 10,
          height: 10,
          length: 10,
          weight: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockResponse: FindProductsResponseDto = {
        results: mockProducts,
        count: mockProducts.length,
      };

      mockProductsService.findAll.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(controller.findAll());

      expect(mockProductsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call productsService.findOneById with the correct id and return the product', async () => {
      const productId = 'product-1';
      const mockProduct: Product = {
        id: productId,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        stockAmount: 10,
        width: 10,
        height: 10,
        length: 10,
        weight: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.findOneById.mockReturnValue(of(mockProduct));

      const result = await firstValueFrom(controller.findOne(productId));

      expect(mockProductsService.findOneById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should call productsService.update with the correct id and data', async () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        id: productId,
        name: 'Updated Product 1',
        description: 'Updated Description',
        price: 150,
      };

      const mockProduct: Product = {
        id: productId,
        name: updateProductDto.name!,
        description: updateProductDto.description!,
        price: updateProductDto.price!,
        stockAmount: 10,
        width: 10,
        height: 10,
        length: 10,
        weight: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.update.mockReturnValue(of(mockProduct));

      const result = await firstValueFrom(
        controller.update(productId, updateProductDto),
      );

      expect(mockProductsService.update).toHaveBeenCalledWith(
        productId,
        updateProductDto,
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('delete', () => {
    it('should call productsService.delete with the correct id', async () => {
      const productId = 'product-1';

      mockProductsService.delete.mockReturnValue(of(undefined));

      const result = await firstValueFrom(controller.delete(productId));

      expect(mockProductsService.delete).toHaveBeenCalledWith(productId);
      expect(result).toBeUndefined();
    });
  });

  describe('addStock', () => {
    it('should call productsService.addToStock with the correct id and amount', async () => {
      const productId = 'product-1';
      const addStockDto: AddStockDto = { amount: 5 };

      mockProductsService.addToStock.mockReturnValue(of(undefined));

      const result = await firstValueFrom(
        controller.addStock(productId, addStockDto),
      );

      expect(mockProductsService.addToStock).toHaveBeenCalledWith(
        productId,
        addStockDto.amount,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('removeStock', () => {
    it('should call productsService.removeFromStock with the correct id and amount', async () => {
      const productId = 'product-1';
      const removeFromStockDto: RemoveFromStockDto = { amount: 5 };

      mockProductsService.removeFromStock.mockReturnValue(of(undefined));

      const result = await firstValueFrom(
        controller.removeStock(productId, removeFromStockDto),
      );

      expect(mockProductsService.removeFromStock).toHaveBeenCalledWith(
        productId,
        removeFromStockDto.amount,
      );
      expect(result).toBeUndefined();
    });
  });
});
