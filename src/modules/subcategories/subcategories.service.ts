import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async createSubcategory(createSubcategory) {
    const category = this.subcategoryRepository.create(createSubcategory);
    return this.subcategoryRepository.save(category);
  }

  async getSubcategories() {
    return this.subcategoryRepository.find({
      relations: ['category', 'products'],
    });
  }

  async getSubcategoryById(id: number) {
    return this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category', 'products'],
    });
  }

  async updateSubcategory(id: number, updateSubcategoryData) {
    await this.subcategoryRepository.update(id, updateSubcategoryData);
    return this.getSubcategoryById(id);
  }

  async deleteSubcategory(id: number) {
    await this.subcategoryRepository.delete(id);
  }
}
