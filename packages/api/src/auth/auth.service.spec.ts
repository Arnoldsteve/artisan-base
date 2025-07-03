import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from './interfaces/auth-repository.interface';

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<IAuthRepository>;
  let jwtService: JwtService;

  beforeEach(async () => {
    repository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      findTenantsByOwnerId: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: 'AuthRepository', useValue: repository },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException if user exists', async () => {
      repository.findUserByEmail.mockResolvedValue({
        id: '1',
        email: 'a@b.com',
      });
      await expect(
        service.signUp({
          email: 'a@b.com',
          password: 'pw',
          firstName: 'A',
        } as any),
      ).rejects.toThrow(ConflictException);
    });
    it('should create user and return token if user does not exist', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      repository.createUser.mockResolvedValue({
        id: '1',
        email: 'a@b.com',
        hashedPassword: 'hashed',
        firstName: 'A',
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      const result = await service.signUp({
        email: 'a@b.com',
        password: 'pw',
        firstName: 'A',
      } as any);
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('user');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'a@b.com', password: 'pw' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should throw UnauthorizedException if password is wrong', async () => {
      repository.findUserByEmail.mockResolvedValue({
        id: '1',
        email: 'a@b.com',
        hashedPassword: 'hashed',
        firstName: 'A',
      });
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);
      await expect(
        service.login({ email: 'a@b.com', password: 'pw' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should return token and organizations if credentials are valid', async () => {
      repository.findUserByEmail.mockResolvedValue({
        id: '1',
        email: 'a@b.com',
        hashedPassword: await require('bcrypt').hash('pw', 10),
        firstName: 'A',
      });
      repository.findTenantsByOwnerId.mockResolvedValue([
        { id: 'org1', name: 'Org', subdomain: 'org' },
      ]);
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      const result = await service.login({
        email: 'a@b.com',
        password: 'pw',
      } as any);
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('organizations');
    });
  });
});
