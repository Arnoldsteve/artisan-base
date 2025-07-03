import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('TenantController', () => {
  let controller: TenantController;
  let tenantService: jest.Mocked<TenantService>;

  beforeEach(async () => {
    tenantService = {
      createTenant: jest.fn(),
      isSubdomainAvailable: jest.fn(),
      suggestAlternativeSubdomains: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        { provide: TenantService, useValue: tenantService },
      ],
    }).compile();
    controller = module.get<TenantController>(TenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkSubdomainAvailability', () => {
    it('should return available if subdomain is available', async () => {
      tenantService.isSubdomainAvailable.mockResolvedValue(true);
      const result = await controller.checkSubdomainAvailability({ subdomain: 'sub' } as any);
      expect(result).toEqual({ isAvailable: true, suggestions: [] });
    });
    it('should return suggestions if subdomain is not available', async () => {
      tenantService.isSubdomainAvailable.mockResolvedValue(false);
      tenantService.suggestAlternativeSubdomains.mockResolvedValue(['sub-1']);
      const result = await controller.checkSubdomainAvailability({ subdomain: 'sub' } as any);
      expect(result).toEqual({ isAvailable: false, suggestions: ['sub-1'] });
    });
  });

  describe('createTenant', () => {
    it('should return tenant on success', async () => {
      const dto = { subdomain: 'sub', storeName: 'store' };
      const user = { sub: 'owner' };
      const tenant = { id: 'tenant', subdomain: 'sub', name: 'store', dbSchema: 'tenant_sub', status: 'ACTIVE', createdAt: new Date() };
      tenantService.createTenant.mockResolvedValue(tenant);
      const result = await controller.createTenant(dto as any, user as any);
      expect(result).toHaveProperty('tenant');
      expect(result).toHaveProperty('success', true);
    });
    it('should throw ConflictException with suggestions', async () => {
      const dto = { subdomain: 'sub', storeName: 'store' };
      const user = { sub: 'owner' };
      tenantService.createTenant.mockRejectedValue(new ConflictException());
      tenantService.suggestAlternativeSubdomains.mockResolvedValue(['sub-1']);
      await expect(controller.createTenant(dto as any, user as any)).rejects.toThrow(ConflictException);
    });
    it('should throw BadRequestException', async () => {
      const dto = { subdomain: 'sub', storeName: 'store' };
      const user = { sub: 'owner' };
      tenantService.createTenant.mockRejectedValue(new BadRequestException());
      await expect(controller.createTenant(dto as any, user as any)).rejects.toThrow(BadRequestException);
    });
  });
});
