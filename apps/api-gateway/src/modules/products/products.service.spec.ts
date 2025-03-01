import { createMock } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { UpdateProductDto } from 'apps/products/src/dto/update-product.dto';
import { of, throwError } from 'rxjs';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const mockProductsClient = createMock<ClientProxy>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'PRODUCTS_SERVICE',
          useValue: mockProductsClient,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should send a message to the products microservice to create a product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        height: 10,
        width: 10,
        length: 10,
        weight: 1,
        stockAmount: 10,
      };

      mockProductsClient.send.mockReturnValue(of('product-created'));

      const result = service.create(createProductDto);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.create',
        createProductDto,
      );
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        height: 10,
        width: 10,
        length: 10,
        weight: 1,
        stockAmount: 10,
      };

      const errorMessage = 'Failed to create product';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.create(createProductDto).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.create',
        createProductDto,
      );
    });
  });

  describe('findAll', () => {
    it('should send a message to the products microservice to find all products', () => {
      mockProductsClient.send.mockReturnValue(of(['product-1', 'product-2']));

      const result = service.findAll();

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.findAll',
        {},
      );
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const errorMessage = 'Failed to find products';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.findAll().subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.findAll',
        {},
      );
    });
  });

  describe('findOneById', () => {
    it('should send a message to the products microservice to find a product by id', () => {
      const productId = 'product-1';

      mockProductsClient.send.mockReturnValue(of('product-found'));

      const result = service.findOneById(productId);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.findOne',
        productId,
      );
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const productId = 'product-1';

      const errorMessage = 'Failed to find product';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.findOneById(productId).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.findOne',
        productId,
      );
    });
  });

  describe('update', () => {
    it('should send a message to the products microservice to update a product', () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        id: productId,
        name: 'Updated Product 1',
        description: 'Updated Description',
        price: 150,
      };

      mockProductsClient.send.mockReturnValue(of('product-updated'));

      const result = service.update(productId, updateProductDto);

      expect(mockProductsClient.send).toHaveBeenCalledWith('products.update', {
        ...updateProductDto,
        id: productId,
      });
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        id: productId,
        name: 'Updated Product 1',
        description: 'Updated Description',
        price: 150,
      };

      const errorMessage = 'Failed to update product';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.update(productId, updateProductDto).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith('products.update', {
        ...updateProductDto,
        id: productId,
      });
    });
  });

  describe('delete', () => {
    it('should send a message to the products microservice to delete a product', () => {
      const productId = 'product-1';

      mockProductsClient.send.mockReturnValue(of('product-deleted'));

      const result = service.delete(productId);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.delete',
        productId,
      );
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const productId = 'product-1';

      const errorMessage = 'Failed to delete product';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.delete(productId).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.delete',
        productId,
      );
    });
  });

  describe('addToStock', () => {
    it('should send a message to the products microservice to add stock', () => {
      const productId = 'product-1';
      const quantity = 5;

      mockProductsClient.send.mockReturnValue(of(undefined));

      const result = service.addToStock(productId, quantity);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.addStock',
        {
          id: productId,
          quantity,
        },
      );
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const productId = 'product-1';
      const quantity = 5;

      const errorMessage = 'Failed to add stock';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.addToStock(productId, quantity).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.addStock',
        {
          id: productId,
          quantity,
        },
      );
    });
  });

  describe('removeFromStock', () => {
    it('should send a message to the products microservice to remove stock', () => {
      const productId = 'product-1';
      const quantity = 5;

      mockProductsClient.send.mockReturnValue(of(undefined));

      const result = service.removeFromStock(productId, quantity);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.removeStock',
        { id: productId, quantity },
      );
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const productId = 'product-1';
      const quantity = 5;

      const errorMessage = 'Failed to remove stock';
      mockProductsClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.removeFromStock(productId, quantity).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.removeStock',
        { id: productId, quantity },
      );
    });
  });
});
