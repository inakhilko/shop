import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    private readonly cache: CacheService,
  ) {}

  async createSubcategory(createSubcategory) {
    await this.cache.delete(`subcategories`);

    const category = this.subcategoryRepository.create(createSubcategory);
    return this.subcategoryRepository.save(category);
  }

  async getSubcategories() {
    const cacheKey = 'subcategories';

    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const subcategories = this.subcategoryRepository.find({
      relations: ['category', 'products'],
    });

    await this.cache.set(cacheKey, subcategories, 3600000);

    return subcategories;
  }

  async getSubcategoryById(id: number) {
    const cacheKey = `subcategories/${id}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const subcategory = this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category', 'products'],
    });

    await this.cache.set(cacheKey, subcategory, 3600000);

    return subcategory;
  }

  async updateSubcategory(id: number, updateSubcategoryData) {
    await this.cache.delete(`subcategories/${id}`);
    await this.cache.delete(`subcategories`);

    await this.subcategoryRepository.update(id, updateSubcategoryData);
    return this.getSubcategoryById(id);
  }

  async deleteSubcategory(id: number) {
    await this.cache.delete(`subcategories/${id}`);
    await this.cache.delete(`subcategories`);

    await this.subcategoryRepository.delete(id);
  }
}
