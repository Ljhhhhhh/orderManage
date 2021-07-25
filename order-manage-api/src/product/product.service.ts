import { User } from '../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
    constructor(
        @Inject('ProductsRepository')
        private readonly productsRepository: typeof Product,
    ) {}

    async findAll(query: {
        pageSize: number;
        current: number;
        name?: string;
        code?: string;
    }) {
        const { pageSize = 10, current = 1, name, code } = query;
        const where: any = {};
        if (name) {
            where.name = {
                [Op.like]: `%${name}%`,
            };
        }
        if (code) {
            where.code = {
                [Op.like]: `%${code}%`,
            };
        }
        const products = await this.productsRepository.findAll<Product>({
            where,
            order: [['createdAt', 'DESC']],
        });
        return products.map(product => new ProductDto(product));
    }

    async findOne(id: number) {
        const product = await this.productsRepository.findByPk<Product>(id, {
            include: [User],
        });
        if (!product) {
            throw new HttpException('No product found', HttpStatus.NOT_FOUND);
        }
        return new ProductDto(product);
    }

    async create(createProductDto: CreateProductDto) {
        const product = new Product();
        product.name = createProductDto.name;
        product.code = createProductDto.code;
        product.spec = createProductDto.spec;
        // product.category = createProductDto.category;
        product.status = 1;
        return product.save();
    }

    private async getUserProduct(id: string) {
        const product = await this.productsRepository.findByPk<Product>(id);
        if (!product) {
            throw new HttpException('No product found', HttpStatus.NOT_FOUND);
        }
        // if (product.userId !== userId) {
        //     throw new HttpException(
        //         'You are unauthorized to manage this product',
        //         HttpStatus.UNAUTHORIZED,
        //     );
        // }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.getUserProduct(id);
        product.name = updateProductDto.name || product.name;
        product.code = updateProductDto.code || product.code;
        product.spec = updateProductDto.spec || product.spec;
        // product.category = updateProductDto.category || product.category;
        product.status =
            typeof updateProductDto.status === 'number'
                ? updateProductDto.status
                : product.status;
        return product.save();
    }

    async delete(id: string) {
        const product = await this.getUserProduct(id);
        await product.destroy();
        return product;
    }
}
