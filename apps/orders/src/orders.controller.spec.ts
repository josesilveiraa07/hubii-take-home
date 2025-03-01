import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase, FindOrderUseCase } from './usecases';
import { FindOrdersUseCase } from './usecases/find-orders.usecase';

describe('OrdersController', () => {
  let controller: OrdersController;
  const mockCreateOrderUseCase = createMock<CreateOrderUseCase>();
  const mockFindOrderUseCase = createMock<FindOrderUseCase>();
  const mockFindOrdersUseCase = createMock<FindOrdersUseCase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: CreateOrderUseCase,
          useValue: mockCreateOrderUseCase,
        },
        {
          provide: FindOrderUseCase,
          useValue: mockFindOrderUseCase,
        },
        {
          provide: FindOrdersUseCase,
          useValue: mockFindOrdersUseCase,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateOrderUseCase.execute with correct data', async () => {
      const createOrderDto: CreateOrderDto = {
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };

      const expectedResult = {
        order: {
          id: '1',
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
        },
        deliveryDetails: {
          'Company A': {
            deliveryTime: '2 dias úteis',
            price: 10.5,
          },
        },
      };

      mockCreateOrderUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(
        createOrderDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw RpcException if CreateOrderUseCase.execute throws', async () => {
      const createOrderDto: CreateOrderDto = {
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [{ productId: '1', quantity: 2 }],
      };

      mockCreateOrderUseCase.execute.mockRejectedValue(
        new RpcException('Error creating order'),
      );

      await expect(controller.create(createOrderDto)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findOneById', () => {
    it('should call FindOrderUseCase.execute with correct id', async () => {
      const orderId = '1';
      const expectedResult = {
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

      mockFindOrderUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findOneById(orderId);

      expect(mockFindOrderUseCase.execute).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw RpcException if FindOrderUseCase.execute throws', async () => {
      const orderId = '1';

      mockFindOrderUseCase.execute.mockRejectedValue(
        new RpcException('Order not found'),
      );

      await expect(controller.findOneById(orderId)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findAll', () => {
    it('should call FindOrdersUseCase.execute', async () => {
      const expectedResult = [
        {
          id: '1',
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
      ];

      const count = expectedResult.length;

      mockFindOrdersUseCase.execute.mockResolvedValue({
        results: expectedResult,
        count,
      });

      const result = await controller.findAll();

      expect(mockFindOrdersUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual({ results: expectedResult, count });
    });
  });
});
