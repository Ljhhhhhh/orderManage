import { Customer } from '../customer/customer.entity';
import { User } from '../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

@Injectable()
export class OrderService {
    constructor(
        @Inject('OrderRepository')
        private readonly orderProviders: typeof Order,
    ) {}

    async findAll(query: {
        pageSize: number;
        current: number;
        orderId?: string;
        nameList?: string;
        customerName?: string;
        salesmanName?: string;
        status?: number;
        username?: string;
        createTime?: string;
    }) {
        const {
            pageSize = 10,
            current = 1,
            orderId,
            nameList,
            customerName,
            salesmanName,
            status,
            createTime,
        } = query;
        const where: any = {};
        const salesmanWhere: any = {};
        const customerWhere: any = {};
        console.log(createTime, 'createTime');
        if (orderId) {
            where.orderId = {
                [Op.like]: `%${orderId}%`,
            };
        }
        if (nameList) {
            where.nameList = {
                [Op.like]: `%${nameList}%`,
            };
        }
        if (status) {
            where.status = status;
        }
        if (createTime) {
            const [startTime, endTime] = createTime;
            console.log(dayjs(startTime).format('YYYY-MM-DD HH:mm Z'));
            where.createdAt = {
                [Op.between]: [
                    dayjs(startTime).format('YYYY-MM-DD HH:mm Z'),
                    dayjs(endTime)
                        .add(1, 'day')
                        .format('YYYY-MM-DD HH:mm Z'),
                ],
            };
        }
        if (salesmanName) {
            salesmanWhere.username = {
                [Op.like]: `%${salesmanName}%`,
            };
        }
        if (customerName) {
            customerWhere.username = {
                [Op.like]: `%${customerName}%`,
            };
        }
        const orders = await this.orderProviders.findAll<Order>({
            where,
            attributes: [
                'orderId',
                'status',
                'createTime',
                'updateTime',
                'customer.id',
                'user.id',
                'nameList',
            ],
            group: [
                'orderId',
                'Order.status',
                'updateTime',
                'createTime',
                'customer.id',
                'user.id',
                'nameList',
            ],
            order: [['createTime', 'DESC']],
            limit: pageSize,
            offset: current === 1 ? 0 : (current - 1) * pageSize,
            include: [
                {
                    model: User,
                    as: 'user',
                    where: salesmanWhere,
                },
                {
                    model: Customer,
                    as: 'customer',
                    where: customerWhere,
                },
            ],
        });

        const all = await this.orderProviders.count({
            where,
            attributes: [
                'orderId',
                // [sequelize.fn('count', sequelize.col('order_id')), 'count'],
            ],
            group: ['orderId'],
        });
        const list = orders.map(order => new OrderDto(order));
        return {
            list,
            total: all.length,
            current,
        };
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

        const orders = await this.orderProviders.findAll<Order>({
            where,
            attributes: ['orderId', 'createTime', 'updateTime', 'nameList'],
            group: [
                'orderId',
                'createTime',
                'updateTime',
                'customer.id',
                'user.id',
                'nameList',
            ],
            order: [['createTime', 'DESC']],
            limit: pageSize,
            offset: current === 1 ? 0 : (current - 1) * pageSize,
            include: [User, Customer],
        });

        const all = await this.orderProviders.count({
            where,
            attributes: [
                'orderId',
                // [sequelize.fn('count', sequelize.col('order_id')), 'count'],
            ],
            group: ['orderId'],
        });
        const list = orders.map(order => new OrderDto(order));
        return {
            list,
            total: all.length,
            current,
        };

        // console.log(ddd, 'ddd---');
        // const orders = await this.orderProviders.findAll<Order>({
        //     where,
        //     limit: pageSize,
        //     offset: current === 1 ? 0 : (current - 1) * pageSize,
        //     include: [User],
        // });

        // const list = orders.map(order => new OrderDto(order));
        // return {
        //     list,
        //     total: await this.orderProviders.count({
        //         where,
        //     }),
        //     current,
        // };
    }

    async findOne(orderId: string) {
        // const order = await this.orderProviders.findByPk<Order>(orderId, {
        //     include: [User],
        // });
        const result = await this.orderProviders.findAll<Order>({
            where: {
                orderId,
                status: {
                    [Op.not]: '-1',
                },
            },
            include: [User, Customer],
        });
        if (!result) {
            throw new HttpException('No post found', HttpStatus.NOT_FOUND);
        }
        const orders = result.map(order => new OrderDto(order));
        return orders;
    }

    async create(userId: string, createOrderDto: CreateOrderDto) {
        const createTime = dayjs().format('YYYY-MM-DD HH:mm');
        const orderProduct = [];
        const orderId =
            dayjs().format('YYYYMMDDHH') +
            Math.floor(Math.random() * 8999 + 1000);
        const customerId = createOrderDto.customerId;
        const nameList = createOrderDto.productList
            .map(p => p.name)
            .join('!@!@');
        createOrderDto.productList.forEach(product => {
            const order = new Order();
            order.orderId = orderId;
            order.name = product.name;
            order.code = product.code;
            order.number = product.number;
            order.category = product.category;
            order.spec = product.spec;
            order.discount = product.discount;
            order.remark = product.remark;
            order.userId = userId;
            order.customerId = customerId;
            order.nameList = nameList;
            order.createTime = createTime;
            order.updateTime = createTime;
            order.status = 0;
            orderProduct.push(order.save());
        });
        return orderProduct;
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

    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const { productList } = updateOrderDto;
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm');
        const nameList = productList.map(p => p.name).join('!@!@');
        try {
            const orderList = await this.orderProviders.findAll<Order>({
                where: {
                    orderId: id,
                },
            });
            if (orderList.length > productList.length) {
                const productListId = productList.map(o => o.id);
                orderList.forEach(item => {
                    if (!productListId.includes(item.id)) {
                        console.log(item, 'item');
                        item.destroy();
                    }
                });
            }
            productList.forEach(async product => {
                let order: any = await this.orderProviders.findByPk<Order>(
                    product.id,
                );

                await order.update({
                    name: product.name,
                    nameList,
                    code: product.code,
                    spec: product.spec,
                    category: product.category,
                    number: product.number,
                    discount: product.discount,
                    status: product.status,
                    updateTime,
                });
            });
            return true;
        } catch (error) {
            return error;
        }
    }

    async delete(id: string, userId: string) {
        const orderList = await this.orderProviders.findAll<Order>({
            where: {
                orderId: id,
            },
        });
        orderList.forEach(async item => {
            await item.destroy();
        });
        return true;
    }
}
