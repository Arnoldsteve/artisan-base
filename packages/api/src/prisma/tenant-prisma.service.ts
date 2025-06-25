import { Injectable, Scope, Inject } from '@nestjs/common';
import { PrismaClient } from '../../generated/tenant';
import { REQUEST } from '@nestjs/core';
import { RequestWithTenant } from '../common/interfaces/request-with-tenant.interface';


@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService extends PrismaClient {
    constructor(
        @Inject(REQUEST) private readonly request: RequestWithTenant,
    ) {
        // ... the rest of the code remains exactly the same
        const tenant = request.tenant;

        if (!tenant) {
            throw new Error('Tenant information is not available on the request.');
        }
        
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