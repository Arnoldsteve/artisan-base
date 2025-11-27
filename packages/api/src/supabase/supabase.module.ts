import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Global() 
@Module({
  imports: [ConfigModule], 
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

// USED IN IMAGE UPLOADS