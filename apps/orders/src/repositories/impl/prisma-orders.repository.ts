import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '../../database/providers/prisma-database.provider';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { Order } from '../../entities/order.entity';
import { OrdersRepository } from '../orders.repository';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaDatabaseProvider) {}

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
        deliveryOptions: {
          create: data.deliveryOptions.map((option) => ({
            companyName: option.companyName,
            price: option.price,
            estimatedArrival: option.estimatedArrival,
          })),
        },
      },
    });
  }

  async findOneById(id: string): Promise<Order | null> {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        deliveryOptions: {
          select: {
            id: true,
            companyName: true,
            estimatedArrival: true,
          },
        },
      },
    });
  }
}
