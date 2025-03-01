import { createMock } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { SubtractFromStockDto } from 'apps/products/src/dto/subtract-from-stock.dto';
import { of } from 'rxjs';
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

  describe('findOneById', () => {
    it('should send a message to the products microservice to find a product by id', () => {
      const productId = 'product-1';
      const mockResponse = { id: productId, name: 'Product 1' };

      mockProductsClient.send.mockReturnValue(of(mockResponse));

      const result = service.findOneById(productId);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.findOne',
        productId,
      );
      expect(result).toBeDefined();
    });
  });

  describe('subtractFromStock', () => {
    it('should send a message to the products microservice to subtract stock', () => {
      const subtractFromStockDto: SubtractFromStockDto = {
        productId: 'product-1',
        amount: 5,
      };

      const mockResponse = { success: true };

      mockProductsClient.send.mockReturnValue(of(mockResponse));

      const result = service.subtractFromStock(subtractFromStockDto);

      expect(mockProductsClient.send).toHaveBeenCalledWith(
        'products.subtractStock',
        subtractFromStockDto,
      );
      expect(result).toBeDefined();
    });
  });
});
