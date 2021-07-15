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
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../decorators/http.decorators';
import { RoleType } from '../shared/enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { Order as OrderEntity } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
@ApiTags('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @ApiOkResponse({ type: [OrderDto] })
    findAll(): Promise<OrderDto[]> {
        return this.orderService.findAll();
    }

    @Get('/list')
    @ApiOkResponse({ type: [OrderDto] })
    @Auth(RoleType.ADMIN, RoleType.SALESMAN)
    findOrderFromUser(@Req() request, @Query() query): Promise<any> {
        return this.orderService.findOrderFromSalesman(request.user.id, query);
    }

    @Get(':id')
    @ApiOkResponse({ type: OrderDto })
    @ApiParam({ name: 'id', required: true })
    findOne(@Param('id', new ParseIntPipe()) id: number): Promise<OrderDto> {
        return this.orderService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: OrderEntity })
    @Auth(RoleType.ADMIN, RoleType.SALESMAN)
    create(
        @Body() createOrderDto: CreateOrderDto,
        @Req() request,
    ): Promise<OrderEntity> {
        return this.orderService.create(request.user.id, createOrderDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: OrderEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id') id: string,
        @Req() request,
        @Body() updateOrderDto: UpdateOrderDto,
    ): Promise<OrderEntity> {
        return this.orderService.update(id, request.user.id, updateOrderDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: OrderEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(@Param('id') id: string, @Req() request): Promise<OrderEntity> {
        return this.orderService.delete(id, request.user.id);
    }
}
