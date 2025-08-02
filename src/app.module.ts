import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './modules/products/entities/product.entity';
import { ProductsModule } from './modules/products/products.module';
import { Category } from './modules/categories/entities/category.entity';
import { Subcategory } from './modules/subcategories/entities/subcategory.entity';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderItem } from './modules/orders/entities/order-item.entity';
import { CartItem } from './modules/cart/entities/cart-item.entity';
import { Order } from './modules/orders/entities/order.entity';
import { Cart } from './modules/cart/entities/cart.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          Product,
          Category,
          Subcategory,
          User,
          Order,
          OrderItem,
          Cart,
          CartItem,
        ],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    SubcategoriesModule,
    OrdersModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
