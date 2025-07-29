import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dtos/products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Body() productDataWithFilter: FilterProductDto) {
    return this.productsService.getProducts(productDataWithFilter);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProduct(+id);
  }

  @Post()
  createProduct(@Body() productData: CreateProductDto) {
    return this.productsService.createProduct(productData);
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(+id, productData);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }
}
