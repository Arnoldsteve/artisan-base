import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Import the main client from the primary package
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// Import the specific StorageClient type from its own sub-package
// THIS LINE WILL NOW WORK because the package has been installed
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