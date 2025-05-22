import { CreateUserInputDto } from '@/app/user/dtos/create-user-input.dto';
import { UserService } from '@/app/user/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserInputDto } from '@/app/user/dtos/update-user-input.dto';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: CreateUserInputDto) {
    return await this.userService.createUser(userDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Listagem de usuarios',
  })
  async findUsers() {
    return await this.userService.listUsers();
  }

  @Get(':id')
  async findUserById(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('ID Invalido'),
      }),
    )
    id: string,
  ) {
    return await this.userService.findUserById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('ID Invalido'),
      }),
    )
    id: string,
  ) {
    return await this.userService.deleteUser(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('ID Invalido'),
      }),
    )
    id: string,
    @Body() userDto: UpdateUserInputDto,
  ) {
    return await this.userService.updateUser(id, userDto);
  }
}
