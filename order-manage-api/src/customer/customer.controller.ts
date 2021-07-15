import {
    Controller,
    Req,
    Body,
    Post,
    UseGuards,
    Get,
    Param,
    Query,
    ParseIntPipe,
    Delete,
    Put,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerService } from './customer.service';
import { AuthGuard } from '@nestjs/passport';
import { Customer as CustomerEntity } from './customer.entity';
import { CustomerDto } from './dto/customer.dto';
import { Auth } from '../decorators/http.decorators';
import { RoleType } from '../shared/enum';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get()
    @ApiOkResponse({ type: [CustomerDto] })
    @Auth(RoleType.ADMIN, RoleType.SALESMAN)
    findAllFromUser(@Query() query, @Req() request): Promise<any> {
        return this.customerService.findAllFromUser(request.user.id, query);
    }

    @Get('/list')
    @ApiOkResponse({ type: [CustomerDto] })
    @Auth(RoleType.ADMIN)
    findAll(@Query() query): Promise<any> {
        return this.customerService.findAll(query);
    }

    @Get(':id')
    @ApiOkResponse({ type: CustomerDto })
    @ApiParam({ name: 'id', required: true })
    findOne(@Param('id') id: string): Promise<CustomerDto> {
        return this.customerService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: CustomerEntity })
    @Auth(RoleType.ADMIN, RoleType.SALESMAN)
    create(
        @Body() createCustomerDto: CreateCustomerDto,
        @Req() request,
    ): Promise<CustomerEntity> {
        return this.customerService.create(request.user.id, createCustomerDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: CustomerEntity })
    @ApiParam({ name: 'id', required: true })
    @Auth(RoleType.ADMIN, RoleType.SALESMAN)
    update(
        @Param('id') id: string,
        @Req() request,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ): Promise<CustomerEntity> {
        return this.customerService.update(
            id,
            request.user.id,
            updateCustomerDto,
        );
    }

    @Delete(':id')
    @ApiOkResponse({ type: CustomerEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(@Param('id') id: string, @Req() request): Promise<CustomerEntity> {
        return this.customerService.delete(id, request.user.id);
    }
}
