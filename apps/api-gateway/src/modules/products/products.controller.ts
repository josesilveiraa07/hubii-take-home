import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProductDto } from 'apps/products/src/dto/update-product.dto';
import { CreateProductDto } from '../../../../products/src/dto/create-product.dto';
import { Product } from '../../../../products/src/entities/product.entity';
import { AddStockDto } from './dto/add-stock.dto';
import { FindProductsResponseDto } from './dto/find-products-response.dto';
import { RemoveFromStockDto } from './dto/remove-from-stock.dto';
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

  /** Atualizar um produto pelo ID */
  @Patch(':id')
  @ApiOkResponse({ type: Product, description: 'Retorna o produto atualizado' })
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.update(id, data);
  }

  /** Deletar produto */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Produto deletado com sucesso' })
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  /** Adicionar ao estoque do produto */
  @Post(':id/stock')
  @ApiCreatedResponse({
    type: Product,
    description: 'Retorna o produto com a quantidade atualizada',
  })
  addStock(@Param('id') id: string, @Body() data: AddStockDto) {
    return this.productsService.addToStock(id, data.amount);
  }

  /** Subtrair estoque do produto */
  @Delete(':id/stock')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Estoque removido com sucesso' })
  removeStock(@Param('id') id: string, @Body() data: RemoveFromStockDto) {
    return this.productsService.removeFromStock(id, data.amount);
  }
}
