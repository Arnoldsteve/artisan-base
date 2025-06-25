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
// Remove JwtService if it's only used for the insecure decode
// import { JwtService } from '@nestjs/jwt'; 
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { GetUser } from '../auth/decorators/get-user.decorator'; // <-- Import your Decorator

// Define what the user payload looks like from the JWT
interface UserPayload {
  sub: string;
  email: string;
  // ... other properties
}


@Controller('tenants')
@UseGuards(JwtAuthGuard) // <-- Protect all routes in this controller
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    // You likely don't need JwtService here anymore
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTenant(
    @Body(ValidationPipe) createTenantDto: CreateTenantDto,
    @GetUser() user: UserPayload, // <-- Use the decorator!
  ) {
    const { subdomain, storeName } = createTenantDto;
    const ownerId = user.sub; // <-- So much cleaner! No checks needed.

    // The guard has already ensured we have a valid user, so no need for:
    // if (!ownerId) {
    //   throw new UnauthorizedException('Valid authentication token required');
    // }

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

  // This endpoint might be public, so you can override the controller-level guard
  // by not adding a @UseGuards here if you want. Let's assume it's also protected.
  @Post('my-tenants')
  @HttpCode(HttpStatus.OK)
  async getMyTenants(
    @GetUser() user: UserPayload,
  ) {
    const ownerId = user.sub;
    
    // const tenants = await this.tenantService.getTenantsByOwner(ownerId);
    return {
      message: 'Method not implemented yet',
    };
  }

  // The check-availability endpoint should probably be public, so no guard.
  // We can achieve this by adding @Public() decorator if you have one, or just by
  // structuring your controllers so public routes are separate.
  // For simplicity, let's assume it's public. We need to import a Public decorator for this.
  
  /*
  @Public() // <-- Custom decorator to bypass the JwtAuthGuard
  @Post('check-availability')
  @HttpCode(HttpStatus.OK)
  async checkSubdomainAvailability(
    @Body(ValidationPipe) checkDto: CheckSubdomainDto,
  ) { ... }
  */
  
  // You no longer need this private method AT ALL.
  // private async extractUserIdFromToken(...) {}
}