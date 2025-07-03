import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authService = {
      signUp: jest.fn(),
      login: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should return signup result', async () => {
      const dto = { email: 'a@b.com', password: 'pw', firstName: 'A' };
      const result = {
        message: 'Signup successful',
        accessToken: 'token',
        user: { id: '1', email: 'a@b.com' },
      };
      authService.signUp.mockResolvedValue(result);
      expect(await controller.signup(dto as any)).toEqual(result);
    });
    it('should throw ConflictException if service throws', async () => {
      authService.signUp.mockRejectedValue(new ConflictException());
      await expect(controller.signup({} as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return login result', async () => {
      const dto = { email: 'a@b.com', password: 'pw' };
      const result = {
        message: 'Login successful',
        accessToken: 'token',
        user: { id: '1', email: 'a@b.com' },
        organizations: [],
      };
      authService.login.mockResolvedValue(result);
      expect(await controller.login(dto as any)).toEqual(result);
    });
    it('should throw UnauthorizedException if service throws', async () => {
      authService.login.mockRejectedValue(new UnauthorizedException());
      await expect(controller.login({} as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
