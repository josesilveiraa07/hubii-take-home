import { createMock } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase, FindOrderUseCase } from './usecases';

describe('OrdersController', () => {
  let controller: OrdersController;
  const mockCreateOrderUseCase = createMock<CreateOrderUseCase>();
  const mockFindOrderUseCase = createMock<FindOrderUseCase>();

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

      // Definindo o comportamento do mock
      mockCreateOrderUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      // Verificações
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
});
