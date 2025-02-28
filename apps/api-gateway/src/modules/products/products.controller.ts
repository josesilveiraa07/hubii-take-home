import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from 'apps/products/src/entities/product.entity';
import { CreateProductDto } from '../../../../products/src/dto/create-product.dto';
import { UpdateProductDto } from '../../../../products/src/dto/update-product.dto';
import { FindProductsResponseDto } from './dto/find-products-response.dto';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** Criar um produto */
  @Post()
  @ApiCreatedResponse({
    type: Product,
    description: 'Retorna o produto criado',
  })
  create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }

  /** Ler todos os produtos */
  @Get()
  @ApiOkResponse({
    type: FindProductsResponseDto,
    description: 'Retorna os produtos retornados e a contagem',
  })
  findAll() {
    return this.productsService.findAll();
  }

  /** Ler produto pelo ID */
  @Get(':id')
  @ApiOkResponse({ type: Product, description: 'Retorna o produto encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }

  /** Deletar produto */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Produto deletado com sucesso' })
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.update(id, data);
  }
}
