// File: packages/api/src/supabase/supabase.module.ts
import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Global() // This makes SupabaseService available everywhere
@Module({
  imports: [ConfigModule], // It needs ConfigModule to read .env variables
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

// USED IN IMAGE UPLOADS