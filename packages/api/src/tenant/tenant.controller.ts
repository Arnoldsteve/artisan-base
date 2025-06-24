import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  Request,
  Headers,
  ValidationPipe,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto, CheckSubdomainDto } from './dto/create-tenant.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTenant(
    @Body(ValidationPipe) createTenantDto: CreateTenantDto,
    @Headers('authorization') authHeader?: string,
    @Request() req?: any,
  ) {
    const { subdomain, storeName } = createTenantDto;
    const ownerId = await this.extractUserIdFromToken(authHeader, req);

    if (!ownerId) {
      throw new UnauthorizedException('Valid authentication token required');
    }

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

  @Post('check-availability')
  @HttpCode(HttpStatus.OK)
  async checkSubdomainAvailability(
    @Body(ValidationPipe) checkDto: CheckSubdomainDto,
  ) {
    const { subdomain } = checkDto;
    const available = await this.tenantService.isSubdomainAvailable(subdomain);
    return {
      subdomain,
      available,
      suggestions: available
        ? []
        : await this.tenantService.suggestAlternativeSubdomains(subdomain),
    };
  }

  @Post('my-tenants')
  @HttpCode(HttpStatus.OK)
  async getMyTenants(
    @Headers('authorization') authHeader?: string,
    @Request() req?: any,
  ) {
    const ownerId = await this.extractUserIdFromToken(authHeader, req);

    if (!ownerId) {
      throw new UnauthorizedException('Valid authentication token required');
    }

    // Example placeholder:
    // const tenants = await this.tenantService.getTenantsByOwner(ownerId);
    return {
      message: 'Method not implemented yet',
    };
  }

  private async extractUserIdFromToken(
    authHeader?: string,
    req?: any,
  ): Promise<string | null> {
    try {
      if (req?.user?.sub) return req.user.sub;
      if (req?.user?.id) return req.user.id;

      if (!authHeader?.startsWith('Bearer ')) return null;

      const token = authHeader.replace('Bearer ', '');
      const decoded = await this.jwtService.decode(token) as any;
      return decoded?.sub ?? null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  }
}
