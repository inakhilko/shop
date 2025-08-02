import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EUserRoles } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: 'user' })
  role: EUserRoles;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
