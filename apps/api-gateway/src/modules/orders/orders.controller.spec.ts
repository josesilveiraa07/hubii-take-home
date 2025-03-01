import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { FindOrdersResponseDto } from 'apps/orders/src/dto/find-orders-response.dto';
import { Order } from 'apps/orders/src/entities/order.entity';
import { firstValueFrom, of } from 'rxjs';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  const mockOrdersService = createMock<OrdersService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ordersService.create with the correct data and return the created order', async () => {
      const createOrderDto: CreateOrderDto = {
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };

      const mockOrder: Order = {
        id: 'order-1',
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
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
        ],
        deliveryOptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse: CreateOrderResponseDto = {
        order: mockOrder,
        deliveryDetails: {},
      };

      mockOrdersService.create.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(controller.create(createOrderDto));

      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call ordersService.findOneById with the correct id and return the order', async () => {
      const orderId = 'order-1';
      const mockOrder: Order = {
        id: orderId,
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [
          {
            id: 'item-1',
            productId: '1',
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        deliveryOptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersService.findOneById.mockReturnValue(of(mockOrder));

      const result = await firstValueFrom(controller.findOne(orderId));

      expect(mockOrdersService.findOneById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should call ordersService.findAll and return the list of orders', async () => {
      const mockOrders: Order[] = [
        {
          id: 'order-1',
          originZipcode: '12345-678',
          destinationZipcode: '87654-321',
          items: [
            {
              id: 'item-1',
              productId: '1',
              quantity: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          deliveryOptions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'order-2',
          originZipcode: '12345-678',
          destinationZipcode: '87654-321',
          items: [
            {
              id: 'item-2',
              productId: '2',
              quantity: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          deliveryOptions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockResponse: FindOrdersResponseDto = {
        results: mockOrders,
        count: mockOrders.length,
      };

      mockOrdersService.findAll.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(controller.findAll());

      expect(mockOrdersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should return an empty list if no orders are found', async () => {
      const mockResponse: FindOrdersResponseDto = {
        results: [],
        count: 0,
      };

      mockOrdersService.findAll.mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(controller.findAll());

      expect(mockOrdersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
