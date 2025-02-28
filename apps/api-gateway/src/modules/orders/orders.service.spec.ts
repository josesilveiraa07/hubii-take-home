import { createMock } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { of } from 'rxjs';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  const mockOrdersClient = createMock<ClientProxy>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: 'ORDERS_SERVICE',
          useValue: mockOrdersClient,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should send a message to the orders microservice to create an order', () => {
      const createOrderDto: CreateOrderDto = {
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };

      mockOrdersClient.send.mockReturnValue(of('order-created'));

      const result = service.create(createOrderDto);

      expect(mockOrdersClient.send).toHaveBeenCalledWith(
        'orders.create',
        createOrderDto,
      );
      expect(result).toBeDefined();
    });
  });

  describe('findOneById', () => {
    it('should send a message to the orders microservice to find an order by id', () => {
      const orderId = 'order-1';

      mockOrdersClient.send.mockReturnValue(of('order-found'));

      const result = service.findOneById(orderId);

      expect(mockOrdersClient.send).toHaveBeenCalledWith(
        'orders.findOne',
        orderId,
      );
      expect(result).toBeDefined();
    });
  });
});
