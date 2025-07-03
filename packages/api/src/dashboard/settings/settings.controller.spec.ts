import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

const mockSettingsService = {
  getSettings: jest.fn(),
  updateSettings: jest.fn(),
};

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: typeof mockSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [{ provide: SettingsService, useValue: mockSettingsService }],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.getSettings on getSettings', async () => {
    const req = { tenant: { id: 'tenant123' } };
    await controller.getSettings(req);
    expect(service.getSettings).toHaveBeenCalledWith('tenant123');
  });

  it('should call service.updateSettings on updateSettings', async () => {
    const req = { tenant: { id: 'tenant123' } };
    const settings = { themeColor: '#fff' };
    await controller.updateSettings(req, settings);
    expect(service.updateSettings).toHaveBeenCalledWith('tenant123', settings);
  });
});
