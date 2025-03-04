import { PrismaOrdersDatabaseProvider } from '@app/database/providers/prisma-orders-database.provider';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { Order } from '../../entities/order.entity';
import { PrismaOrdersRepository } from './prisma-orders.repository';

describe('PrismaOrdersRepository', () => {
  let repository: PrismaOrdersRepository;
  const mockPrisma = createMock<PrismaOrdersDatabaseProvider>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOrdersRepository,
        {
          provide: PrismaOrdersDatabaseProvider,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaOrdersRepository>(PrismaOrdersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with items and delivery options', async () => {
      const createOrderDto: CreateOrderDto = {
        originZipcode: '12345-678',
        destinationZipcode: '87654-321',
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
        deliveryOptions: [
          {
            companyName: 'Transportadora A',
            price: 10,
            estimatedArrival: '2 dias úteis',
          },
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
      };

      mockPrisma.order.create = jest.fn().mockResolvedValue(mockOrder);

      const result = await repository.create(createOrderDto);

      expect(mockPrisma.order.create).toHaveBeenCalledWith({
        data: {
          destinationZipcode: createOrderDto.destinationZipcode,
          originZipcode: createOrderDto.originZipcode,
          items: {
            create: createOrderDto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
          deliveryOptions: {
            create: createOrderDto.deliveryOptions?.map((option) => ({
              companyName: option.companyName,
              price: option.price,
              estimatedArrival: option.estimatedArrival,
            })),
          },
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should create an order without delivery options if not provided', async () => {
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

      mockPrisma.order.create = jest.fn().mockResolvedValue(mockOrder);

      const result = await repository.create(createOrderDto);

      expect(mockPrisma.order.create).toHaveBeenCalledWith({
        data: {
          destinationZipcode: createOrderDto.destinationZipcode,
          originZipcode: createOrderDto.originZipcode,
          items: {
            create: createOrderDto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
          deliveryOptions: undefined,
        },
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findOneById', () => {
    it('should find an order by id with items and delivery options', async () => {
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
      };

      mockPrisma.order.findUnique = jest.fn().mockResolvedValue(mockOrder);

      const result = await repository.findOneById(orderId);

      expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: {
          deliveryOptions: {
            select: {
              id: true,
              companyName: true,
              estimatedArrival: true,
              price: true,
            },
          },
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should return null if the order is not found', async () => {
      const orderId = 'order-1';

      mockPrisma.order.findUnique = jest.fn().mockResolvedValue(null);

      const result = await repository.findOneById(orderId);

      expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: {
          deliveryOptions: {
            select: {
              id: true,
              companyName: true,
              estimatedArrival: true,
              price: true,
            },
          },
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all orders with items and delivery options', async () => {
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

      mockPrisma.order.findMany = jest.fn().mockResolvedValue(mockOrders);

      const result = await repository.findAll();

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        include: {
          deliveryOptions: {
            select: {
              id: true,
              companyName: true,
              estimatedArrival: true,
              price: true,
            },
          },
        },
      });
      expect(result).toEqual(mockOrders);
    });

    it('should return an empty array if no orders are found', async () => {
      mockPrisma.order.findMany = jest.fn().mockResolvedValue([]);

      const result = await repository.findAll();

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        include: {
          deliveryOptions: {
            select: {
              id: true,
              companyName: true,
              estimatedArrival: true,
              price: true,
            },
          },
        },
      });
      expect(result).toEqual([]);
    });
  });

  describe('count', () => {
    it('should return the total number of orders', async () => {
      const totalOrders = 10;
      mockPrisma.order.count = jest.fn().mockResolvedValue(totalOrders);

      const result = await repository.count();

      expect(mockPrisma.order.count).toHaveBeenCalled();
      expect(result).toEqual(totalOrders);
    });

    it('should return 0 if there are no orders', async () => {
      mockPrisma.order.count = jest.fn().mockResolvedValue(0);

      const result = await repository.count();

      expect(mockPrisma.order.count).toHaveBeenCalled();
      expect(result).toEqual(0);
    });
  });
});
