import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { Order } from 'apps/orders/src/entities/order.entity';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** Criar um pedido */
  @ApiCreatedResponse({
    description: 'Pedido criado com sucesso',
    type: CreateOrderResponseDto,
  })
  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.ordersService.create(data);
  }

  /** Obter um pedido por ID */
  @Get(':id')
  @ApiOkResponse({ type: Order, description: 'Retorna o pedido encontrado' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOneById(id);
  }
}
