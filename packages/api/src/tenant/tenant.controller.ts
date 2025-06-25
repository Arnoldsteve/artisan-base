import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
  BadRequestException,
  ValidationPipe,
  UseGuards, 
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto, CheckSubdomainDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator'; 
import { UserPayload } from 'src/common/interfaces/user-payload.interface';


@Controller('api/v1/tenants')
@UseGuards(JwtAuthGuard) 
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTenant(
    @Body(ValidationPipe) createTenantDto: CreateTenantDto,
    @GetUser() user: UserPayload, 
  ) {
    const { subdomain, storeName } = createTenantDto;
    const ownerId = user.sub; 

  
    try {
      const tenant = await this.tenantService.createTenant(ownerId, subdomain, storeName);

      return {
        success: true,
        tenant: {
          id: tenant.id,
          subdomain: tenant.subdomain,
          name: tenant.name,
          dbSchema: tenant.dbSchema,
          status: tenant.status,
          createdAt: tenant.createdAt,
        },
        message: 'Tenant created successfully',
        url: `https://${subdomain}.yourapp.com`,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        const suggestions = await this.tenantService.suggestAlternativeSubdomains(subdomain);
        throw new ConflictException({
          message: `Subdomain '${subdomain}' is already taken`,
          suggestions,
        });
      }

      if (error instanceof BadRequestException) throw error;
      throw error;
    }
  }
}