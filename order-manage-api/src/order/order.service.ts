import { User } from '../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
    constructor(
        @Inject('OrderRepository')
        private readonly OrderProviders: typeof Order,
    ) {}

    async findAll() {
        const orders = await this.OrderProviders.findAll<Order>({
            include: [User],
        });
        return orders.map(order => new OrderDto(order));
    }

    async findOne(id: number) {
        const order = await this.OrderProviders.findByPk<Order>(id, {
            include: [User],
        });
        if (!order) {
            throw new HttpException('No post found', HttpStatus.NOT_FOUND);
        }
        return new OrderDto(order);
    }

    async create(userId: string, createOrderDto: CreateOrderDto) {
        const order = new Order();
        order.userId = userId;
        order.name = createOrderDto.name;
        order.spec = createOrderDto.spec;
        return order.save();
    }

    private async getUserOrder(id: number, userId: string) {
        const order = await this.OrderProviders.findByPk<Order>(id);
        if (!order) {
            throw new HttpException('No order found', HttpStatus.NOT_FOUND);
        }
        if (order.userId !== userId) {
            throw new HttpException(
                'You are unauthorized to manage this order',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return order;
    }

    async update(id: number, userId: string, updateOrderDto: UpdateOrderDto) {
        const order = await this.getUserOrder(id, userId);
        order.name = updateOrderDto.name || order.name;
        order.spec = updateOrderDto.spec || order.spec;
        return order.save();
    }

    async delete(id: number, userId: string) {
        const post = await this.getUserOrder(id, userId);
        await post.destroy();
        return post;
    }
}
