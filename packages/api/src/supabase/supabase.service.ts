import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageClient } from '@supabase/storage-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase URL or Key is not defined in .env');
      throw new Error('Supabase configuration is missing.');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized successfully.');
  }

  // The type annotation is now valid
  getStorageClient(): StorageClient {
    return this.client.storage;
  }
}