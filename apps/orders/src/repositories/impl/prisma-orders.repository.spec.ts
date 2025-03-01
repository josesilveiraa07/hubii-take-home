import { PrismaDatabaseProvider } from '@app/database/providers/prisma-database.provider';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { Order } from '../../entities/order.entity';
import { PrismaOrdersRepository } from './prisma-orders.repository';

describe('PrismaOrdersRepository', () => {
  let repository: PrismaOrdersRepository;
  const mockPrisma = createMock<PrismaDatabaseProvider>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOrdersRepository,
        {
          provide: PrismaDatabaseProvider,
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
          deliveryOptions: undefined, // Sem deliveryOptions
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
          items: { include: { product: true } },
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
          items: { include: { product: true } },
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
});
