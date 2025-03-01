import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersRepository } from '../repositories/orders.repository';
import { FindOrdersUseCase } from './find-orders.usecase';

describe('FindOrdersUseCase', () => {
  const mockOrdersRepository = createMock<OrdersRepository>();

  let useCase: FindOrdersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrdersUseCase,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOrdersUseCase>(FindOrdersUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const mockOrders = [
      {
        id: 'order-1',
        originZipcode: '12345-678',
        destinationZipcode: '12345-678',
        items: [
          {
            id: 'item-1',
            productId: '1',
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        deliveryOptions: [
          {
            id: 'option-1',
            companyName: 'Transportadora A',
            price: 10,
            estimatedArrival: '2 dias úteis',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'order-2',
        originZipcode: '12345-678',
        destinationZipcode: '12345-678',
        items: [
          {
            id: 'item-2',
            productId: '2',
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        deliveryOptions: [
          {
            id: 'option-2',
            companyName: 'Transportadora B',
            price: 15,
            estimatedArrival: '3 dias úteis',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return a list of orders and the total count', async () => {
      mockOrdersRepository.findAll.mockResolvedValue(mockOrders);
      mockOrdersRepository.count.mockResolvedValue(mockOrders.length);

      const result = await useCase.execute();

      expect(mockOrdersRepository.findAll).toHaveBeenCalled();
      expect(mockOrdersRepository.count).toHaveBeenCalled();
      expect(result).toEqual({
        results: mockOrders,
        count: mockOrders.length,
      });
    });

    it('should return an empty list and count 0 if no orders are found', async () => {
      mockOrdersRepository.findAll.mockResolvedValue([]);
      mockOrdersRepository.count.mockResolvedValue(0);

      const result = await useCase.execute();

      expect(mockOrdersRepository.findAll).toHaveBeenCalled();
      expect(mockOrdersRepository.count).toHaveBeenCalled();
      expect(result).toEqual({
        results: [],
        count: 0,
      });
    });
  });
});
