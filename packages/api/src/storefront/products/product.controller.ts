
import { Controller } from "@nestjs/common";

@Controller('v1/storefront/products')
export class StorefrontProductController {
    // ... methods to get public product data, no auth guard needed
}