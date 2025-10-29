import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { DashboardUsersService } from './dashboard-users.service';
import { CreateDashboardUserDto } from './dto/create-dashboard-user.dto';
import { UpdateDashboardUserDto } from './dto/update-dashboard-user.dto';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';
import { Roles, RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@prisma/client/management';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';

@Controller('dashboard/users')
@UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(TransformResponseInterceptor)
export class DashboardUsersController {
  constructor(private readonly usersService: DashboardUsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) dto: CreateDashboardUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  // @Roles([UserRole.PLATFORM_ADMIN])
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateDashboardUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
