import { createMock } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { of, throwError } from 'rxjs';
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

    it('should return an error object if the microservice call fails', () => {
      const createOrderDto: CreateOrderDto = {
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };

      const errorMessage = 'Failed to create order';
      mockOrdersClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.create(createOrderDto).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockOrdersClient.send).toHaveBeenCalledWith(
        'orders.create',
        createOrderDto,
      );
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

    it('should return an error object if the microservice call fails', () => {
      const orderId = 'order-1';

      const errorMessage = 'Failed to find order';
      mockOrdersClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.findOneById(orderId).subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockOrdersClient.send).toHaveBeenCalledWith(
        'orders.findOne',
        orderId,
      );
    });
  });

  describe('findAll', () => {
    it('should send a message to the orders microservice to find all orders', () => {
      mockOrdersClient.send.mockReturnValue(of('orders-found'));

      const result = service.findAll();

      expect(mockOrdersClient.send).toHaveBeenCalledWith('orders.findAll', {});
      expect(result).toBeDefined();
    });

    it('should return an error object if the microservice call fails', () => {
      const errorMessage = 'Failed to find orders';
      mockOrdersClient.send.mockReturnValue(
        throwError(() => ({ message: errorMessage })),
      );

      service.findAll().subscribe((response) => {
        expect(response).toEqual({ error: errorMessage });
      });

      expect(mockOrdersClient.send).toHaveBeenCalledWith('orders.findAll', {});
    });
  });
});
