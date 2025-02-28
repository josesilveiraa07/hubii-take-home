import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Product } from 'apps/products/src/entities/product.entity';
import { firstValueFrom } from 'rxjs';
import { DeliveryCalculationService } from '../common/shared/modules/delivery-calculation.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ProductsService } from '../modules/products.service';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    private readonly deliveryCalculationService: DeliveryCalculationService,
  ) {}

  async execute(input: CreateOrderDto) {
    let volume: number = 0;
    let weight: number = 0;

    for (let i = 0; i < input.items.length; i++) {
      const item = input.items[i];
      const product: Product = await firstValueFrom(
        this.productsService.findOneById(item.productId),
      );

      if (!product) {
        throw new RpcException(`Product with id ${item.productId} not found`);
      }

      if (product.stockAmount < item.quantity) {
        throw new RpcException(
          `Product with id ${item.productId} has no stock`,
        );
      }

      const itemVolume = product.height * product.width * product.length;

      volume += itemVolume;
      weight += product.weight;
    }

    const power = 1 / 3;
    const cubicRoot = Math.pow(volume, power);

    const length = cubicRoot;
    const height = cubicRoot;
    const width = cubicRoot;

    const deliveryDetails =
      await this.deliveryCalculationService.calculatePrice({
        length,
        height,
        weight,
        width,
        origin: input.originZipcode,
        destination: input.destinationZipcode,
      });

    const order = await this.ordersRepository.create(input);

    return {
      order,
      deliveryDetails,
    };
  }
}
