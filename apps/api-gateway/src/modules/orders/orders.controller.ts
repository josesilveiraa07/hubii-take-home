import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { FindOrdersResponseDto } from 'apps/orders/src/dto/find-orders-response.dto';
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

  /** Obter todos os pedidos */
  @Get()
  @ApiOkResponse({
    type: FindOrdersResponseDto,
    description: 'Retorna todos os pedidos',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  /** Obter um pedido por ID */
  @Get(':id')
  @ApiOkResponse({ type: Order, description: 'Retorna o pedido encontrado' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOneById(id);
  }
}
