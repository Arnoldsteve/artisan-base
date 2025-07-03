service = await module.resolve<CustomerService>(CustomerService);
repository = module.get("CustomerRepository");
