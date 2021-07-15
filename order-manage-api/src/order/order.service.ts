import { User } from '../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Op } from 'sequelize';

@Injectable()
export class OrderService {
    constructor(
        @Inject('OrderRepository')
        private readonly orderProviders: typeof Order,
    ) {}

    async findAll() {
        const orders = await this.orderProviders.findAll<Order>({
            include: [User],
        });
        return orders.map(order => new OrderDto(order));
    }

    async findOrderFromSalesman(
        userId: string,
        query: {
            pageSize: number;
            current: number;
            username?: string;
        },
    ) {
        const { pageSize = 10, current = 1, username } = query;
        const where: any = {
            userId,
        };
        if (username) {
            where.username = {
                [Op.like]: `%${username}%`,
            };
        }
        const customers = await this.orderProviders.findAll<Order>({
            where,
            limit: pageSize,
            offset: current === 1 ? 0 : (current - 1) * pageSize,
            include: [User],
        });

        const list = customers.map(customer => new OrderDto(customer));
        return {
            list,
            total: await this.orderProviders.count({
                where,
            }),
            current,
        };
    }

    async findOne(id: number) {
        const order = await this.orderProviders.findByPk<Order>(id, {
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
        order.customerId = createOrderDto.customerId;
        order.name = createOrderDto.name;
        order.code = createOrderDto.code;
        order.category = createOrderDto.category;
        order.spec = createOrderDto.spec;
        order.discount = createOrderDto.discount;
        order.remark = createOrderDto.remark;
        order.status = 0;
        console.log(order, 'order');
        return order.save();
    }

    private async getUserOrder(id: string, userId: string) {
        const order = await this.orderProviders.findByPk<Order>(id);
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

    async update(id: string, userId: string, updateOrderDto: UpdateOrderDto) {
        const order = await this.getUserOrder(id, userId);
        order.name = updateOrderDto.name || order.name;
        order.spec = updateOrderDto.spec || order.spec;
        return order.save();
    }

    async delete(id: string, userId: string) {
        const post = await this.getUserOrder(id, userId);
        await post.destroy();
        return post;
    }
}
