import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { ITenantRepository } from './interfaces/tenant-repository.interface';
import {
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('TenantService', () => {
  let service: TenantService;
  let repository: jest.Mocked<ITenantRepository>;

  beforeEach(async () => {
    repository = {
      findUserById: jest.fn(),
      findTenantBySubdomain: jest.fn(),
      createTenant: jest.fn(),
      deleteTenantById: jest.fn(),
      executeRaw: jest.fn(),
      readTenantMigrationSql: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: 'TenantRepository', useValue: repository },
      ],
    }).compile();
    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTenant', () => {
    it('should throw BadRequestException if owner does not exist', async () => {
      repository.findUserById.mockResolvedValue(null);
      await expect(
        service.createTenant('owner', 'sub', 'store'),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw ConflictException if subdomain exists', async () => {
      repository.findUserById.mockResolvedValue({ id: 'owner' });
      repository.findTenantBySubdomain.mockResolvedValue({ id: 'tenant' });
      await expect(
        service.createTenant('owner', 'sub', 'store'),
      ).rejects.toThrow(ConflictException);
    });
    it('should create tenant and schema and run migrations', async () => {
      repository.findUserById.mockResolvedValue({ id: 'owner' });
      repository.findTenantBySubdomain.mockResolvedValue(null);
      repository.createTenant.mockResolvedValue({
        id: 'tenant',
        subdomain: 'sub',
        name: 'store',
        dbSchema: 'tenant_sub',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      repository.executeRaw.mockResolvedValue(undefined);
      repository.readTenantMigrationSql.mockResolvedValue(
        'CREATE TABLE test (id INT);',
      );
      const result = await service.createTenant('owner', 'sub', 'store');
      expect(result).toHaveProperty('id', 'tenant');
      expect(repository.createTenant).toHaveBeenCalled();
      expect(repository.executeRaw).toHaveBeenCalledWith(
        expect.stringContaining('CREATE SCHEMA'),
      );
    });
    it('should rollback on error and throw InternalServerErrorException', async () => {
      repository.findUserById.mockResolvedValue({ id: 'owner' });
      repository.findTenantBySubdomain.mockResolvedValue(null);
      repository.createTenant.mockResolvedValue({
        id: 'tenant',
        subdomain: 'sub',
        name: 'store',
        dbSchema: 'tenant_sub',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      repository.executeRaw.mockImplementationOnce(() => {
        throw new Error('fail');
      });
      repository.deleteTenantById.mockResolvedValue(undefined);
      await expect(
        service.createTenant('owner', 'sub', 'store'),
      ).rejects.toThrow(InternalServerErrorException);
      expect(repository.deleteTenantById).toHaveBeenCalled();
    });
  });

  describe('isSubdomainAvailable', () => {
    it('should return true if subdomain is available', async () => {
      repository.findTenantBySubdomain.mockResolvedValue(null);
      expect(await service.isSubdomainAvailable('sub')).toBe(true);
    });
    it('should return false if subdomain is taken', async () => {
      repository.findTenantBySubdomain.mockResolvedValue({ id: 'tenant' });
      expect(await service.isSubdomainAvailable('sub')).toBe(false);
    });
  });

  describe('suggestAlternativeSubdomains', () => {
    it('should suggest alternatives', async () => {
      repository.findTenantBySubdomain.mockResolvedValueOnce({ id: 'tenant' });
      repository.findTenantBySubdomain.mockResolvedValue(null);
      const result = await service.suggestAlternativeSubdomains('base');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
