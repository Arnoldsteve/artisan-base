import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { NotFoundException } from "@nestjs/common";
import { IProductRepository } from "./interfaces/product-repository.interface";

describe("ProductService", () => {
  let service: ProductService;
  let repository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<IProductRepository> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: "ProductRepository", useValue: repoMock },
      ],
    }).compile();
    service = await module.resolve<ProductService>(ProductService);
    repository = module.get("ProductRepository");
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a product", async () => {
    const dto = { name: "A", slug: "a", price: 10 };
    const mockProduct = { id: "1", ...dto };
    repository.create.mockResolvedValue(mockProduct);
    const result = await service.create(dto as any);
    expect(result).toEqual(mockProduct);
  });

  it("should find a product by id", async () => {
    const mockProduct = { id: "1", name: "A", slug: "a", price: 10 };
    repository.findOne.mockResolvedValue(mockProduct);
    const result = await service.findOne("1");
    expect(result).toEqual(mockProduct);
  });

  it("should throw NotFoundException if product not found", async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne("bad-id")).rejects.toThrow(NotFoundException);
  });

  it("should update a product", async () => {
    const mockProduct = { id: "1", name: "A", slug: "a", price: 10 };
    repository.findOne.mockResolvedValue(mockProduct);
    repository.update.mockResolvedValue({ ...mockProduct, name: "B" });
    const result = await service.update("1", { name: "B" } as any);
    expect(result).toEqual({ ...mockProduct, name: "B" });
  });

  it("should delete a product", async () => {
    const mockProduct = { id: "1", name: "A", slug: "a", price: 10 };
    repository.findOne.mockResolvedValue(mockProduct);
    repository.remove.mockResolvedValue(mockProduct);
    const result = await service.remove("1");
    expect(result).toBeUndefined();
  });
});
