import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class ProductDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly code: string;

    @ApiProperty()
    readonly spec: string;

    @ApiProperty()
    readonly discount: string;

    // @ApiProperty()
    // readonly category: string;

    @ApiProperty()
    readonly status: 0 | 1;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.code = product.code;
        this.spec = product.spec;
        this.status = product.status;
        // this.category = product.category;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }
}
