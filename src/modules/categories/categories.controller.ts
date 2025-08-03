import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CategoriesService } from './categories.service';
import { Public } from '../auth/decorators/public.decorator';
import { EUserRoles } from '../users/constants/constants';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(EUserRoles.ADMIN)
  @Post()
  create(@Body() createCategoryData: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryData);
  }

  @Public()
  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Public()
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(+id);
  }

  @Roles(EUserRoles.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @Roles(EUserRoles.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(+id);
  }
}
