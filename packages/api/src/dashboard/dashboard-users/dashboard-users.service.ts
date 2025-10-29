import { Injectable, NotFoundException } from '@nestjs/common';
import { DashboardUsersRepository } from './dashboard-users.repository';
import { CreateDashboardUserDto } from './dto/create-dashboard-user.dto';
import { UpdateDashboardUserDto } from './dto/update-dashboard-user.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Injectable()
export class DashboardUsersService {
  constructor(private readonly dashboardUsersRepository: DashboardUsersRepository) {}

  
  create(createDashboardUserDto: CreateDashboardUserDto) {
    return this.dashboardUsersRepository.create(createDashboardUserDto);
  }

  findAll(pagination?: PaginationQueryDto) {
    return this.dashboardUsersRepository.findAll(pagination);
  }

  findOne(id: string) {
    return this.dashboardUsersRepository.findOne(id)
  }


  async update(id: string, updateDashboardUserDto: UpdateDashboardUserDto) {
    return this.dashboardUsersRepository.update(id, updateDashboardUserDto);
  }

  async remove(id: string) {
    const user = await this.dashboardUsersRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    await this.dashboardUsersRepository.remove(id);
  }
}
