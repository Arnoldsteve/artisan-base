import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { ISettingsRepository } from './interfaces/settings-repository.interface';

const mockSettingsRepository = {
  getSettings: jest.fn(),
  updateSettings: jest.fn(),
};

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: typeof mockSettingsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: ISettingsRepository, useValue: mockSettingsRepository },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get(ISettingsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.getSettings on getSettings', () => {
    service.getSettings('tenant123');
    expect(repository.getSettings).toHaveBeenCalledWith('tenant123');
  });

  it('should call repository.updateSettings on updateSettings', () => {
    const settings = { themeColor: '#fff' };
    service.updateSettings('tenant123', settings);
    expect(repository.updateSettings).toHaveBeenCalledWith(
      'tenant123',
      settings,
    );
  });
});
