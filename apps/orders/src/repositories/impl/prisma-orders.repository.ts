import { PrismaOrdersDatabaseProvider } from '@app/database/providers/prisma-orders-database.provider';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { Order } from '../../entities/order.entity';
import { OrdersRepository } from '../orders.repository';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaOrdersDatabaseProvider) {}

  async create(data: CreateOrderDto): Promise<Order> {
    return await this.prisma.order.create({
      data: {
        destinationZipcode: data.destinationZipcode,
        originZipcode: data.originZipcode,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
        deliveryOptions: data.deliveryOptions && {
          create: data.deliveryOptions.map((option) => ({
            companyName: option.companyName,
            price: option.price,
            estimatedArrival: option.estimatedArrival,
          })),
        },
      },
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.prisma.order.findMany({
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
  }

  async findOneById(id: string): Promise<Order | null> {
    return await this.prisma.order.findUnique({
      where: { id },
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
  }
  async count(): Promise<number> {
    return await this.prisma.order.count();
  }
}
