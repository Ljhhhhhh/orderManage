import { User } from '../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Op } from 'sequelize';
import shortid from 'shortid';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './customer.entity';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @Inject('CustomerRepository')
        private readonly customerRepository: typeof Customer,
    ) {}

    async findAllFromUser(
        salesmanId: string,
        query: {
            pageSize: number;
            current: number;
            username?: string;
        },
    ) {
        const { pageSize = 10, current = 1, username } = query;
        const where: any = {
            salesmanId,
        };
        if (username) {
            where.username = {
                [Op.like]: `%${username}%`,
            };
        }
        const customers = await this.customerRepository.findAll<Customer>({
            where,
            limit: pageSize,
            offset: current === 1 ? 0 : (current - 1) * pageSize,
            include: [User],
        });

        const list = customers.map(customer => new CustomerDto(customer));
        return {
            list,
            total: await this.customerRepository.count({
                where,
            }),
            current,
        };
    }

    async findAll(query: {
        pageSize: number;
        current: number;
        username?: string;
        linkName?: string;
    }) {
        const { pageSize = 10, current = 1, username, linkName } = query;
        const where: any = {};
        if (username) {
            where.username = {
                [Op.like]: `%${username}%`,
            };
        }
        if (linkName) {
            where.linkName = {
                [Op.like]: `%${linkName}%`,
            };
        }
        const customers = await this.customerRepository.findAll<Customer>({
            where,
            order: [['updatedAt', 'DESC']],
            limit: pageSize,
            offset: current === 1 ? 0 : (current - 1) * pageSize,
            include: [User],
        });

        const list = customers.map(customer => new CustomerDto(customer));
        return {
            list,
            total: await this.customerRepository.count({
                where,
            }),
            current,
        };
    }

    async findOne(id: string) {
        const customer = await this.customerRepository.findByPk<Customer>(id, {
            include: [User],
        });
        if (!customer) {
            throw new HttpException('No customer found', HttpStatus.NOT_FOUND);
        }
        return new CustomerDto(customer);
    }

    async create(salesmanId: string, CreateCustomerDto: CreateCustomerDto) {
        const customer = new Customer();
        customer.salesmanId = salesmanId;
        customer.username = CreateCustomerDto.username;
        customer.code = shortid.generate();
        customer.address = CreateCustomerDto.address;
        customer.linkName = CreateCustomerDto.linkName;
        customer.phone = CreateCustomerDto.phone;
        customer.remark = CreateCustomerDto.remark;
        return customer.save();
    }

    private async getUserCustomer(id: string, salesmanId: string) {
        const customer = await this.customerRepository.findByPk<Customer>(id);
        if (!customer) {
            throw new HttpException('No customer found', HttpStatus.NOT_FOUND);
        }
        if (customer.salesmanId !== salesmanId) {
            throw new HttpException(
                '你没有权限操作此用户',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return customer;
    }

    async update(
        id: string,
        salesmanId: string,
        updateCustomerDto: UpdateCustomerDto,
    ) {
        const customer = await this.getUserCustomer(id, salesmanId);
        customer.username = updateCustomerDto.username || customer.username;
        customer.address = updateCustomerDto.address || customer.address;
        customer.phone = updateCustomerDto.phone || customer.phone;
        customer.linkName = updateCustomerDto.linkName || customer.linkName;
        customer.remark = updateCustomerDto.remark || customer.remark;
        return customer.save();
    }

    async delete(id: string, salesmanId: string) {
        const customer = await this.getUserCustomer(id, salesmanId);
        await customer.destroy();
        return customer;
    }
}
