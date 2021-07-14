import { UserLoginRequestDto } from './dto/user-login-request.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    Delete,
    Req,
    UseGuards,
    Param,
    Put,
    Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import {
    ApiTags,
    ApiParam,
    ApiOkResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../decorators/http.decorators';
// import { Roles } from '../decorators/roles.decorator';
import { RoleType } from '../shared/enum';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @ApiOkResponse({ type: UserLoginResponseDto })
    register(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserLoginResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOkResponse({ type: UserLoginResponseDto })
    login(
        @Body() userLoginRequestDto: UserLoginRequestDto,
    ): Promise<UserLoginResponseDto> {
        return this.usersService.login(userLoginRequestDto);
    }

    @Get()
    @Auth(RoleType.ADMIN)
    @ApiOkResponse({ type: [UserDto] })
    async findAll(@Query() query): Promise<any> {
        return this.usersService.findAll(query);
    }

    // 改用@auth

    @Get('me')
    // @Auth(RoleType.ADMIN)
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserDto })
    async getUser(@Req() request): Promise<UserDto> {
        return this.usersService.getUser(request.user.id);
    }

    @Put('me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserDto })
    update(
        @Body() updateUserDto: UpdateUserDto,
        @Req() request,
    ): Promise<UserDto> {
        return this.usersService.update(request.user.id, updateUserDto);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @ApiOkResponse({ type: UserDto })
    @ApiParam({ name: 'id', required: true })
    updateFromAdmin(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id') id: string,
    ): Promise<UserDto> {
        return {} as any;
        // return this.usersService.updateFromAdmin(id, updateUserDto);
    }

    @Delete('me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserDto })
    delete(@Req() request): Promise<UserDto> {
        return this.usersService.delete(request.user.id);
    }
}
