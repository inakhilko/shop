import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategory) {
    const category = this.categoryRepository.create(createCategory);
    return this.categoryRepository.save(category);
  }

  async getCategories() {
    return this.categoryRepository.find({
      relations: ['subcategories', 'products'],
    });
  }

  async getCategoryById(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['subcategories', 'products'],
    });
  }

  async updateCategory(id: number, updateCategory) {
    await this.categoryRepository.update(id, updateCategory);
    return this.getCategoryById(id);
  }

  async deleteCategory(id: number) {
    await this.categoryRepository.delete(id);
  }
}
