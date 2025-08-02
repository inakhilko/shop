import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { EUserRoles } from '../users/dtos/user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { SubcategoriesService } from './subcategories.service';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
} from './dtos/subcategory.dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Roles(EUserRoles.ADMIN)
  @Post()
  create(@Body() createCategoryData: CreateSubcategoryDto) {
    return this.subcategoriesService.createSubcategory(createCategoryData);
  }

  @Public()
  @Get()
  getCategories() {
    return this.subcategoriesService.getSubcategories();
  }

  @Public()
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.subcategoriesService.getSubcategoryById(+id);
  }

  @Roles(EUserRoles.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.updateSubcategory(+id, updateCategoryDto);
  }

  @Roles(EUserRoles.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subcategoriesService.deleteSubcategory(+id);
  }
}
