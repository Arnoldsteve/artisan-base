import { CACHE_NAMESPACE } from './cache.constants';
import * as crypto from 'crypto';

export class CacheEngine {
  /**
   * Generates a unique, short fingerprint for query arguments.
   */
  static generateSubKey(args: any): string {
    const queryStr = JSON.stringify(args || {});
    return crypto.createHash('sha256').update(queryStr).digest('hex').slice(0, 16);
  }

  /**
   * Convention-over-Configuration: Maps 'Product' -> 'PRODUCT_LIST'
   */
 static getNamespaceForModel(model: string): CACHE_NAMESPACE {
  const key = model
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toUpperCase() + '_LIST';
  return (CACHE_NAMESPACE as any)[key] || (key as any);
}
}