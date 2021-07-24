import {
    Controller,
    Req,
    Body,
    Post,
    UseGuards,
    Get,
    Param,
    ParseIntPipe,
    Delete,
    Query,
    Put,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { Product as ProductEntity } from './product.entity';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../decorators/http.decorators';
import { RoleType } from '../shared/enum';

@Controller('product')
@ApiTags('product')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOkResponse({ type: [ProductDto] })
    findAll(@Query() query): Promise<ProductDto[]> {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    @ApiOkResponse({ type: ProductDto })
    @ApiParam({ name: 'id', required: true })
    findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ProductDto> {
        return this.productsService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: ProductEntity })
    @Auth(RoleType.ADMIN)
    create(
        @Body() createProductDto: CreateProductDto,
        @Req() request,
    ): Promise<ProductEntity> {
        return this.productsService.create(createProductDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: ProductEntity })
    @Auth(RoleType.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<ProductEntity> {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: ProductEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(@Param('id') id: string, @Req() request): Promise<ProductEntity> {
        return this.productsService.delete(id);
    }
}
