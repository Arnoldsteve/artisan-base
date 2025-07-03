import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { ICategoryRepository } from './interfaces/category-repository.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockCategoryRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: typeof mockCategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: ICategoryRepository, useValue: mockCategoryRepository },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get(ICategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.create on create', () => {
    const dto = { name: 'Test' } as CreateCategoryDto;
    service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should call repository.findAll on findAll', () => {
    service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should call repository.findOne on findOne', () => {
    service.findOne('1');
    expect(repository.findOne).toHaveBeenCalledWith('1');
  });

  it('should call repository.update on update', () => {
    const dto = { name: 'Updated' } as UpdateCategoryDto;
    service.update('1', dto);
    expect(repository.update).toHaveBeenCalledWith('1', dto);
  });

  it('should call repository.remove on remove', () => {
    service.remove('1');
    expect(repository.remove).toHaveBeenCalledWith('1');
  });
});
