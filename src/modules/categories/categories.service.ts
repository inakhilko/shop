import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cache: CacheService,
  ) {}

  async createCategory(createCategory) {
    await this.cache.delete(`categories`);

    const category = this.categoryRepository.create(createCategory);
    return this.categoryRepository.save(category);
  }

  async getCategories() {
    const cacheKey = 'categories';

    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const categories = this.categoryRepository.find({
      relations: ['subcategories', 'products'],
    });

    await this.cache.set(cacheKey, categories, 3600000);

    return categories;
  }

  async getCategoryById(id: number) {
    const cacheKey = `categories/${id}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const category = this.categoryRepository.findOne({
      where: { id },
      relations: ['subcategories', 'products'],
    });

    await this.cache.set(cacheKey, category, 3600000);

    return category;
  }

  async updateCategory(id: number, updateCategory) {
    await this.cache.delete(`categories/${id}`);
    await this.cache.delete(`categories`);

    await this.categoryRepository.update(id, updateCategory);
    return this.getCategoryById(id);
  }

  async deleteCategory(id: number) {
    await this.cache.delete(`categories/${id}`);
    await this.cache.delete(`categories`);

    await this.categoryRepository.delete(id);
  }
}
