import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './dtos/products.dto';
import { Between, Equal, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

type ISearchAndFilterParams =
  | FindOptionsWhere<Product>
  | FindOptionsWhere<Product>[]
  | undefined;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly cache: CacheService,
  ) {}

  async getProducts(
    productDataWithFilter: FilterProductDto,
  ): Promise<Product[]> {
    const { search, minPrice, maxPrice, categoryId, subcategoryId } =
      productDataWithFilter || {};

    const parameters: ISearchAndFilterParams = {};

    if (search) {
      parameters.name = Like(`%${search}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      parameters.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      parameters.price = Between(minPrice, Number.MAX_SAFE_INTEGER);
    } else if (maxPrice !== undefined) {
      parameters.price = Between(0, maxPrice);
    }

    if (categoryId) {
      parameters.category = Equal(categoryId);
    }

    if (subcategoryId) {
      parameters.subcategory = Equal(subcategoryId);
    }

    return this.productsRepository.find({ where: parameters });
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async getProduct(id: number): Promise<Product | null> {
    const cacheKey = `products/${id}`;

    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const product = this.productsRepository.findOne({ where: { id } });

    await this.cache.set(cacheKey, product, 3600000);

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    await this.cache.delete(`products/${id}`);

    await this.productsRepository.update(id, updateProductDto);
    return this.productsRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.cache.delete(`products/${id}`);

    await this.productsRepository.delete(id);
  }
}
