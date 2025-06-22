// In packages/api/src/store/store.controller.ts

import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('stores') // Base path for this controller is /stores
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post() // Handles POST /stores
  @UseGuards(AuthGuard('jwt')) // 1. Protect this route with our JWT guard
  create(@Request() req, @Body() createStoreDto: CreateStoreDto) {
    // 2. The `req.user` object is attached by our JwtStrategy
    const userId = req.user.id;

    // 3. Call the service with the user's ID and the validated DTO data
    return this.storeService.create(
      userId,
      createStoreDto.id,
      createStoreDto.name,
    );
  }
}