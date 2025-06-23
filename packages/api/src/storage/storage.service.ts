// In packages/api/src/storage/storage.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    // 1. Get the variables from the ConfigService
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    // 2. Check if they exist. If not, crash the app on startup.
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        'Supabase URL or Service Role Key is not configured in environment variables.',
      );
    }

    // 3. Now that TypeScript knows they are strings, create the client.
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  async createSignedUploadUrl(path: string) {
    const { data, error } = await this.supabase.storage
      .from('product-images')
      .createSignedUploadUrl(path); 

    if (error) {
      throw new Error('Could not create signed upload URL');
    }

    return data;
  }
}
