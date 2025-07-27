import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/tenant';
import { REQUEST } from '@nestjs/core';
import { RequestWithTenant } from '../common/interfaces/request-with-tenant.interface';


@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService extends PrismaClient {
    newsletterSubscription: any;
    constructor(
        @Inject(REQUEST) private readonly request: RequestWithTenant,
    ) {
        // ... the rest of the code remains exactly the same
        const tenant = request.tenant;

        if (!tenant) {
            throw new Error('Tenant information is not available on the request.');
        }
        Logger.log(`[TenantPrismaService] Creating instance for schema: ${tenant.dbSchema}`);
        
        const databaseUrl = process.env.DATABASE_URL;
        const urlWithSchema = `${databaseUrl}?schema=${tenant.dbSchema}`;

        super({
            datasources: {
                db: {
                    url: urlWithSchema,
                },
            },
        });
    }
}