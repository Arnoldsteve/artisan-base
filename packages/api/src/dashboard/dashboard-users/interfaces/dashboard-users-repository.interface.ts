import { CreateDashboardUserDto } from "../dto/create-dashboard-user.dto";
import { UpdateDashboardUserDto } from "../dto/update-dashboard-user.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

export interface IDashboardUsersRepository {
  create(dto: CreateDashboardUserDto): Promise<any>;
  findAll(pagination?: PaginationQueryDto): Promise<any>;
  findOne(id: string): Promise<any>;
  update(id: string, dto: UpdateDashboardUserDto): Promise<any>;
  remove(id: string): Promise<any>;
}
