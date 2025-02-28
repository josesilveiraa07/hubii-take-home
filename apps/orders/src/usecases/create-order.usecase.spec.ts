import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'apps/products/src/entities/product.entity';
import { of } from 'rxjs';
import { DeliveryCalculationService } from '../common/shared/modules/delivery-calculation.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { ProductsService } from '../modules/products.service';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderUseCase } from './create-order.usecase';

describe('CreateOrderUseCase', () => {
  const mockOrdersRepository = createMock<OrdersRepository>();
  const mockProductsService = createMock<ProductsService>();
  const mockDeliveryCalculationService =
    createMock<DeliveryCalculationService>();

  let useCase: CreateOrderUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: DeliveryCalculationService,
          useValue: mockDeliveryCalculationService,
        },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createOrderDto: CreateOrderDto = {
      originZipcode: '12345-678',
      destinationZipcode: '87654-321',
      items: [
        { productId: '1', quantity: 2 },
        { productId: '2', quantity: 1 },
      ],
    };

    const mockProduct1: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      height: 10,
      width: 10,
      length: 10,
      weight: 1,
      stockAmount: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProduct2: Product = {
      id: '2',
      name: 'Product 2',
      description: 'Description of Product 2',
      price: 200,
      height: 20,
      width: 20,
      length: 20,
      weight: 2,
      stockAmount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create an order successfully', async () => {
      mockProductsService.findOneById.mockImplementation(
        (productId: string) => {
          if (productId === '1') return of(mockProduct1);
          if (productId === '2') return of(mockProduct2);
          return of(null);
        },
      );

      mockProductsService.subtractFromStock.mockReturnValue(of(undefined));

      mockDeliveryCalculationService.calculatePrice.mockResolvedValue({
        'Transportadora A': { price: 10, deliveryTime: '2 dias úteis' },
        'Transportadora B': { price: 15, deliveryTime: '1 dia útil' },
      });

      mockOrdersRepository.create.mockResolvedValue({
        id: 'order-1',
        ...createOrderDto,
        items: [
          {
            id: 'item-1',
            productId: '1',
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'item-2',
            productId: '2',
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ] as OrderItem[],
        deliveryOptions: [
          {
            id: 'option-1',
            companyName: 'Transportadora A',
            price: 10,
            estimatedArrival: '2 dias úteis',
          },
          {
            id: 'option-2',
            companyName: 'Transportadora B',
            price: 15,
            estimatedArrival: '1 dia útil',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order);

      const result = await useCase.execute(createOrderDto);

      expect(mockProductsService.findOneById).toHaveBeenCalledTimes(2);
      expect(mockProductsService.subtractFromStock).toHaveBeenCalledTimes(2);
      expect(mockDeliveryCalculationService.calculatePrice).toHaveBeenCalled();
      expect(mockOrdersRepository.create).toHaveBeenCalled();

      expect(result).toEqual({
        order: {
          id: 'order-1',
          ...createOrderDto,
          items: [
            {
              id: 'item-1',
              productId: '1',
              quantity: 2,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
            {
              id: 'item-2',
              productId: '2',
              quantity: 1,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          ],
          deliveryOptions: [
            {
              id: 'option-1',
              companyName: 'Transportadora A',
              price: 10,
              estimatedArrival: '2 dias úteis',
            },
            {
              id: 'option-2',
              companyName: 'Transportadora B',
              price: 15,
              estimatedArrival: '1 dia útil',
            },
          ],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        deliveryDetails: {
          'Transportadora A': { price: 10, deliveryTime: '2 dias úteis' },
          'Transportadora B': { price: 15, deliveryTime: '1 dia útil' },
        },
      });
    });

    it('should throw RpcException if a product is not found', async () => {
      mockProductsService.findOneById.mockImplementation(() => of(null));

      await expect(useCase.execute(createOrderDto)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsService.findOneById).toHaveBeenCalledWith('1');
    });

    it('should throw RpcException if a product has no stock', async () => {
      mockProductsService.findOneById.mockImplementation(
        (productId: string) => {
          if (productId === '1') return of({ ...mockProduct1, stockAmount: 0 });
          return of(null);
        },
      );

      await expect(useCase.execute(createOrderDto)).rejects.toThrow(
        RpcException,
      );
      expect(mockProductsService.findOneById).toHaveBeenCalledWith('1');
    });
  });
});
