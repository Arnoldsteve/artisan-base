
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model SubscriptionPlan
 * 
 */
export type SubscriptionPlan = $Result.DefaultSelection<Prisma.$SubscriptionPlanPayload>
/**
 * Model TenantSubscription
 * 
 */
export type TenantSubscription = $Result.DefaultSelection<Prisma.$TenantSubscriptionPayload>
/**
 * Model SubscriptionPayment
 * 
 */
export type SubscriptionPayment = $Result.DefaultSelection<Prisma.$SubscriptionPaymentPayload>
/**
 * Model PaymentIndex
 * 
 */
export type PaymentIndex = $Result.DefaultSelection<Prisma.$PaymentIndexPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TenantStatus: {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED'
};

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus]


export const BillingCycle: {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
};

export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle]


export const SubscriptionStatus: {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAST_DUE: 'PAST_DUE',
  UNPAID: 'UNPAID'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const UserRole: {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  PLATFORM_SUPPORT: 'PLATFORM_SUPPORT',
  TENANT_OWNER: 'TENANT_OWNER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type TenantStatus = $Enums.TenantStatus

export const TenantStatus: typeof $Enums.TenantStatus

export type BillingCycle = $Enums.BillingCycle

export const BillingCycle: typeof $Enums.BillingCycle

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptionPlan`: Exposes CRUD operations for the **SubscriptionPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPlans
    * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
    * ```
    */
  get subscriptionPlan(): Prisma.SubscriptionPlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantSubscription`: Exposes CRUD operations for the **TenantSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantSubscriptions
    * const tenantSubscriptions = await prisma.tenantSubscription.findMany()
    * ```
    */
  get tenantSubscription(): Prisma.TenantSubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptionPayment`: Exposes CRUD operations for the **SubscriptionPayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPayments
    * const subscriptionPayments = await prisma.subscriptionPayment.findMany()
    * ```
    */
  get subscriptionPayment(): Prisma.SubscriptionPaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paymentIndex`: Exposes CRUD operations for the **PaymentIndex** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentIndices
    * const paymentIndices = await prisma.paymentIndex.findMany()
    * ```
    */
  get paymentIndex(): Prisma.PaymentIndexDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    User: 'User',
    RefreshToken: 'RefreshToken',
    SubscriptionPlan: 'SubscriptionPlan',
    TenantSubscription: 'TenantSubscription',
    SubscriptionPayment: 'SubscriptionPayment',
    PaymentIndex: 'PaymentIndex'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenant" | "user" | "refreshToken" | "subscriptionPlan" | "tenantSubscription" | "subscriptionPayment" | "paymentIndex"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionPlan: {
        payload: Prisma.$SubscriptionPlanPayload<ExtArgs>
        fields: Prisma.SubscriptionPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          findMany: {
            args: Prisma.SubscriptionPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          create: {
            args: Prisma.SubscriptionPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          createMany: {
            args: Prisma.SubscriptionPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          update: {
            args: Prisma.SubscriptionPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionPlan>
          }
          groupBy: {
            args: Prisma.SubscriptionPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPlanCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanCountAggregateOutputType> | number
          }
        }
      }
      TenantSubscription: {
        payload: Prisma.$TenantSubscriptionPayload<ExtArgs>
        fields: Prisma.TenantSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.TenantSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          findMany: {
            args: Prisma.TenantSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          create: {
            args: Prisma.TenantSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          createMany: {
            args: Prisma.TenantSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.TenantSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          update: {
            args: Prisma.TenantSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.TenantSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantSubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.TenantSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.TenantSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantSubscription>
          }
          groupBy: {
            args: Prisma.TenantSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<TenantSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionPayment: {
        payload: Prisma.$SubscriptionPaymentPayload<ExtArgs>
        fields: Prisma.SubscriptionPaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>
          }
          findMany: {
            args: Prisma.SubscriptionPaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>[]
          }
          create: {
            args: Prisma.SubscriptionPaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>
          }
          createMany: {
            args: Prisma.SubscriptionPaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionPaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionPaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>
          }
          update: {
            args: Prisma.SubscriptionPaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionPaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionPaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPaymentPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionPayment>
          }
          groupBy: {
            args: Prisma.SubscriptionPaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPaymentCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPaymentCountAggregateOutputType> | number
          }
        }
      }
      PaymentIndex: {
        payload: Prisma.$PaymentIndexPayload<ExtArgs>
        fields: Prisma.PaymentIndexFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentIndexFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentIndexFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>
          }
          findFirst: {
            args: Prisma.PaymentIndexFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentIndexFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>
          }
          findMany: {
            args: Prisma.PaymentIndexFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>[]
          }
          create: {
            args: Prisma.PaymentIndexCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>
          }
          createMany: {
            args: Prisma.PaymentIndexCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentIndexCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>[]
          }
          delete: {
            args: Prisma.PaymentIndexDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>
          }
          update: {
            args: Prisma.PaymentIndexUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>
          }
          deleteMany: {
            args: Prisma.PaymentIndexDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentIndexUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentIndexUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>[]
          }
          upsert: {
            args: Prisma.PaymentIndexUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentIndexPayload>
          }
          aggregate: {
            args: Prisma.PaymentIndexAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentIndex>
          }
          groupBy: {
            args: Prisma.PaymentIndexGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentIndexGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentIndexCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentIndexCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    user?: UserOmit
    refreshToken?: RefreshTokenOmit
    subscriptionPlan?: SubscriptionPlanOmit
    tenantSubscription?: TenantSubscriptionOmit
    subscriptionPayment?: SubscriptionPaymentOmit
    paymentIndex?: PaymentIndexOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    paymentIndices: number
    SubscriptionPayment: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paymentIndices?: boolean | TenantCountOutputTypeCountPaymentIndicesArgs
    SubscriptionPayment?: boolean | TenantCountOutputTypeCountSubscriptionPaymentArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPaymentIndicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentIndexWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSubscriptionPaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPaymentWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ownedTenant: number
    refreshTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedTenant?: boolean | UserCountOutputTypeCountOwnedTenantArgs
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedTenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }


  /**
   * Count Type SubscriptionPlanCountOutputType
   */

  export type SubscriptionPlanCountOutputType = {
    subscriptions: number
    tenants: number
  }

  export type SubscriptionPlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | SubscriptionPlanCountOutputTypeCountSubscriptionsArgs
    tenants?: boolean | SubscriptionPlanCountOutputTypeCountTenantsArgs
  }

  // Custom InputTypes
  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanCountOutputType
     */
    select?: SubscriptionPlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
  }

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountTenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
  }


  /**
   * Count Type TenantSubscriptionCountOutputType
   */

  export type TenantSubscriptionCountOutputType = {
    SubscriptionPayment: number
  }

  export type TenantSubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    SubscriptionPayment?: boolean | TenantSubscriptionCountOutputTypeCountSubscriptionPaymentArgs
  }

  // Custom InputTypes
  /**
   * TenantSubscriptionCountOutputType without action
   */
  export type TenantSubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscriptionCountOutputType
     */
    select?: TenantSubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantSubscriptionCountOutputType without action
   */
  export type TenantSubscriptionCountOutputTypeCountSubscriptionPaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    subdomain: string | null
    customDomain: string | null
    dbSchema: string | null
    status: $Enums.TenantStatus | null
    suspendedAt: Date | null
    deletedAt: Date | null
    ownerId: string | null
    planId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    stripeCustomerId: string | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    subdomain: string | null
    customDomain: string | null
    dbSchema: string | null
    status: $Enums.TenantStatus | null
    suspendedAt: Date | null
    deletedAt: Date | null
    ownerId: string | null
    planId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    stripeCustomerId: string | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    subdomain: number
    customDomain: number
    dbSchema: number
    status: number
    suspendedAt: number
    deletedAt: number
    ownerId: number
    planId: number
    settings: number
    createdAt: number
    updatedAt: number
    stripeCustomerId: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    customDomain?: true
    dbSchema?: true
    status?: true
    suspendedAt?: true
    deletedAt?: true
    ownerId?: true
    planId?: true
    createdAt?: true
    updatedAt?: true
    stripeCustomerId?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    customDomain?: true
    dbSchema?: true
    status?: true
    suspendedAt?: true
    deletedAt?: true
    ownerId?: true
    planId?: true
    createdAt?: true
    updatedAt?: true
    stripeCustomerId?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    customDomain?: true
    dbSchema?: true
    status?: true
    suspendedAt?: true
    deletedAt?: true
    ownerId?: true
    planId?: true
    settings?: true
    createdAt?: true
    updatedAt?: true
    stripeCustomerId?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    subdomain: string
    customDomain: string | null
    dbSchema: string
    status: $Enums.TenantStatus
    suspendedAt: Date | null
    deletedAt: Date | null
    ownerId: string
    planId: string | null
    settings: JsonValue | null
    createdAt: Date
    updatedAt: Date
    stripeCustomerId: string | null
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    customDomain?: boolean
    dbSchema?: boolean
    status?: boolean
    suspendedAt?: boolean
    deletedAt?: boolean
    ownerId?: boolean
    planId?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    paymentIndices?: boolean | Tenant$paymentIndicesArgs<ExtArgs>
    SubscriptionPayment?: boolean | Tenant$SubscriptionPaymentArgs<ExtArgs>
    subscription?: boolean | Tenant$subscriptionArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
    plan?: boolean | Tenant$planArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    customDomain?: boolean
    dbSchema?: boolean
    status?: boolean
    suspendedAt?: boolean
    deletedAt?: boolean
    ownerId?: boolean
    planId?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    plan?: boolean | Tenant$planArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    customDomain?: boolean
    dbSchema?: boolean
    status?: boolean
    suspendedAt?: boolean
    deletedAt?: boolean
    ownerId?: boolean
    planId?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    plan?: boolean | Tenant$planArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    subdomain?: boolean
    customDomain?: boolean
    dbSchema?: boolean
    status?: boolean
    suspendedAt?: boolean
    deletedAt?: boolean
    ownerId?: boolean
    planId?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stripeCustomerId?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "subdomain" | "customDomain" | "dbSchema" | "status" | "suspendedAt" | "deletedAt" | "ownerId" | "planId" | "settings" | "createdAt" | "updatedAt" | "stripeCustomerId", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paymentIndices?: boolean | Tenant$paymentIndicesArgs<ExtArgs>
    SubscriptionPayment?: boolean | Tenant$SubscriptionPaymentArgs<ExtArgs>
    subscription?: boolean | Tenant$subscriptionArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
    plan?: boolean | Tenant$planArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    plan?: boolean | Tenant$planArgs<ExtArgs>
  }
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    plan?: boolean | Tenant$planArgs<ExtArgs>
  }

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      paymentIndices: Prisma.$PaymentIndexPayload<ExtArgs>[]
      SubscriptionPayment: Prisma.$SubscriptionPaymentPayload<ExtArgs>[]
      subscription: Prisma.$TenantSubscriptionPayload<ExtArgs> | null
      owner: Prisma.$UserPayload<ExtArgs>
      plan: Prisma.$SubscriptionPlanPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      subdomain: string
      customDomain: string | null
      dbSchema: string
      status: $Enums.TenantStatus
      suspendedAt: Date | null
      deletedAt: Date | null
      ownerId: string
      planId: string | null
      settings: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      stripeCustomerId: string | null
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    paymentIndices<T extends Tenant$paymentIndicesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$paymentIndicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    SubscriptionPayment<T extends Tenant$SubscriptionPaymentArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$SubscriptionPaymentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscription<T extends Tenant$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$subscriptionArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends Tenant$planArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$planArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly subdomain: FieldRef<"Tenant", 'String'>
    readonly customDomain: FieldRef<"Tenant", 'String'>
    readonly dbSchema: FieldRef<"Tenant", 'String'>
    readonly status: FieldRef<"Tenant", 'TenantStatus'>
    readonly suspendedAt: FieldRef<"Tenant", 'DateTime'>
    readonly deletedAt: FieldRef<"Tenant", 'DateTime'>
    readonly ownerId: FieldRef<"Tenant", 'String'>
    readonly planId: FieldRef<"Tenant", 'String'>
    readonly settings: FieldRef<"Tenant", 'Json'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
    readonly stripeCustomerId: FieldRef<"Tenant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.paymentIndices
   */
  export type Tenant$paymentIndicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    where?: PaymentIndexWhereInput
    orderBy?: PaymentIndexOrderByWithRelationInput | PaymentIndexOrderByWithRelationInput[]
    cursor?: PaymentIndexWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentIndexScalarFieldEnum | PaymentIndexScalarFieldEnum[]
  }

  /**
   * Tenant.SubscriptionPayment
   */
  export type Tenant$SubscriptionPaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    where?: SubscriptionPaymentWhereInput
    orderBy?: SubscriptionPaymentOrderByWithRelationInput | SubscriptionPaymentOrderByWithRelationInput[]
    cursor?: SubscriptionPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionPaymentScalarFieldEnum | SubscriptionPaymentScalarFieldEnum[]
  }

  /**
   * Tenant.subscription
   */
  export type Tenant$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    where?: TenantSubscriptionWhereInput
  }

  /**
   * Tenant.plan
   */
  export type Tenant$planArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    where?: SubscriptionPlanWhereInput
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    hashedPassword: string | null
    firstName: string | null
    lastName: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    hashedPassword: string | null
    firstName: string | null
    lastName: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    hashedPassword: number
    firstName: number
    lastName: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    hashedPassword?: true
    firstName?: true
    lastName?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    hashedPassword?: true
    firstName?: true
    lastName?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    hashedPassword?: true
    firstName?: true
    lastName?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    hashedPassword: string
    firstName: string | null
    lastName: string | null
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    hashedPassword?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownedTenant?: boolean | User$ownedTenantArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    hashedPassword?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    hashedPassword?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    hashedPassword?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "hashedPassword" | "firstName" | "lastName" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedTenant?: boolean | User$ownedTenantArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ownedTenant: Prisma.$TenantPayload<ExtArgs>[]
      refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      hashedPassword: string
      firstName: string | null
      lastName: string | null
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ownedTenant<T extends User$ownedTenantArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedTenantArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    refreshTokens<T extends User$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly hashedPassword: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.ownedTenant
   */
  export type User$ownedTenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    cursor?: TenantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * User.refreshTokens
   */
  export type User$refreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    ipAddress: string | null
    userAgent: string | null
    familyId: string | null
    parentTokenId: string | null
    revoked: boolean | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    ipAddress: string | null
    userAgent: string | null
    familyId: string | null
    parentTokenId: string | null
    revoked: boolean | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    ipAddress: number
    userAgent: number
    familyId: number
    parentTokenId: number
    revoked: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    ipAddress?: true
    userAgent?: true
    familyId?: true
    parentTokenId?: true
    revoked?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    ipAddress?: true
    userAgent?: true
    familyId?: true
    parentTokenId?: true
    revoked?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    ipAddress?: true
    userAgent?: true
    familyId?: true
    parentTokenId?: true
    revoked?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    userId: string
    tokenHash: string
    ipAddress: string | null
    userAgent: string | null
    familyId: string | null
    parentTokenId: string | null
    revoked: boolean
    expiresAt: Date
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    familyId?: boolean
    parentTokenId?: boolean
    revoked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    familyId?: boolean
    parentTokenId?: boolean
    revoked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    familyId?: boolean
    parentTokenId?: boolean
    revoked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    familyId?: boolean
    parentTokenId?: boolean
    revoked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenHash" | "ipAddress" | "userAgent" | "familyId" | "parentTokenId" | "revoked" | "expiresAt" | "createdAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenHash: string
      ipAddress: string | null
      userAgent: string | null
      familyId: string | null
      parentTokenId: string | null
      revoked: boolean
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly tokenHash: FieldRef<"RefreshToken", 'String'>
    readonly ipAddress: FieldRef<"RefreshToken", 'String'>
    readonly userAgent: FieldRef<"RefreshToken", 'String'>
    readonly familyId: FieldRef<"RefreshToken", 'String'>
    readonly parentTokenId: FieldRef<"RefreshToken", 'String'>
    readonly revoked: FieldRef<"RefreshToken", 'Boolean'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model SubscriptionPlan
   */

  export type AggregateSubscriptionPlan = {
    _count: SubscriptionPlanCountAggregateOutputType | null
    _avg: SubscriptionPlanAvgAggregateOutputType | null
    _sum: SubscriptionPlanSumAggregateOutputType | null
    _min: SubscriptionPlanMinAggregateOutputType | null
    _max: SubscriptionPlanMaxAggregateOutputType | null
  }

  export type SubscriptionPlanAvgAggregateOutputType = {
    price: Decimal | null
  }

  export type SubscriptionPlanSumAggregateOutputType = {
    price: Decimal | null
  }

  export type SubscriptionPlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    price: Decimal | null
    billingCycle: $Enums.BillingCycle | null
    createdAt: Date | null
    providerPlanId: string | null
  }

  export type SubscriptionPlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    price: Decimal | null
    billingCycle: $Enums.BillingCycle | null
    createdAt: Date | null
    providerPlanId: string | null
  }

  export type SubscriptionPlanCountAggregateOutputType = {
    id: number
    name: number
    price: number
    billingCycle: number
    features: number
    createdAt: number
    providerPlanId: number
    _all: number
  }


  export type SubscriptionPlanAvgAggregateInputType = {
    price?: true
  }

  export type SubscriptionPlanSumAggregateInputType = {
    price?: true
  }

  export type SubscriptionPlanMinAggregateInputType = {
    id?: true
    name?: true
    price?: true
    billingCycle?: true
    createdAt?: true
    providerPlanId?: true
  }

  export type SubscriptionPlanMaxAggregateInputType = {
    id?: true
    name?: true
    price?: true
    billingCycle?: true
    createdAt?: true
    providerPlanId?: true
  }

  export type SubscriptionPlanCountAggregateInputType = {
    id?: true
    name?: true
    price?: true
    billingCycle?: true
    features?: true
    createdAt?: true
    providerPlanId?: true
    _all?: true
  }

  export type SubscriptionPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlan to aggregate.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPlans
    **/
    _count?: true | SubscriptionPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPlanMaxAggregateInputType
  }

  export type GetSubscriptionPlanAggregateType<T extends SubscriptionPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
      : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
  }




  export type SubscriptionPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanWhereInput
    orderBy?: SubscriptionPlanOrderByWithAggregationInput | SubscriptionPlanOrderByWithAggregationInput[]
    by: SubscriptionPlanScalarFieldEnum[] | SubscriptionPlanScalarFieldEnum
    having?: SubscriptionPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPlanCountAggregateInputType | true
    _avg?: SubscriptionPlanAvgAggregateInputType
    _sum?: SubscriptionPlanSumAggregateInputType
    _min?: SubscriptionPlanMinAggregateInputType
    _max?: SubscriptionPlanMaxAggregateInputType
  }

  export type SubscriptionPlanGroupByOutputType = {
    id: string
    name: string
    price: Decimal
    billingCycle: $Enums.BillingCycle
    features: JsonValue
    createdAt: Date
    providerPlanId: string | null
    _count: SubscriptionPlanCountAggregateOutputType | null
    _avg: SubscriptionPlanAvgAggregateOutputType | null
    _sum: SubscriptionPlanSumAggregateOutputType | null
    _min: SubscriptionPlanMinAggregateOutputType | null
    _max: SubscriptionPlanMaxAggregateOutputType | null
  }

  type GetSubscriptionPlanGroupByPayload<T extends SubscriptionPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    billingCycle?: boolean
    features?: boolean
    createdAt?: boolean
    providerPlanId?: boolean
    subscriptions?: boolean | SubscriptionPlan$subscriptionsArgs<ExtArgs>
    tenants?: boolean | SubscriptionPlan$tenantsArgs<ExtArgs>
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    billingCycle?: boolean
    features?: boolean
    createdAt?: boolean
    providerPlanId?: boolean
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    billingCycle?: boolean
    features?: boolean
    createdAt?: boolean
    providerPlanId?: boolean
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectScalar = {
    id?: boolean
    name?: boolean
    price?: boolean
    billingCycle?: boolean
    features?: boolean
    createdAt?: boolean
    providerPlanId?: boolean
  }

  export type SubscriptionPlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "price" | "billingCycle" | "features" | "createdAt" | "providerPlanId", ExtArgs["result"]["subscriptionPlan"]>
  export type SubscriptionPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | SubscriptionPlan$subscriptionsArgs<ExtArgs>
    tenants?: boolean | SubscriptionPlan$tenantsArgs<ExtArgs>
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubscriptionPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SubscriptionPlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SubscriptionPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionPlan"
    objects: {
      subscriptions: Prisma.$TenantSubscriptionPayload<ExtArgs>[]
      tenants: Prisma.$TenantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      price: Prisma.Decimal
      billingCycle: $Enums.BillingCycle
      features: Prisma.JsonValue
      createdAt: Date
      providerPlanId: string | null
    }, ExtArgs["result"]["subscriptionPlan"]>
    composites: {}
  }

  type SubscriptionPlanGetPayload<S extends boolean | null | undefined | SubscriptionPlanDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPlanPayload, S>

  type SubscriptionPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionPlanCountAggregateInputType | true
    }

  export interface SubscriptionPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPlan'], meta: { name: 'SubscriptionPlan' } }
    /**
     * Find zero or one SubscriptionPlan that matches the filter.
     * @param {SubscriptionPlanFindUniqueArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPlanFindUniqueArgs>(args: SelectSubset<T, SubscriptionPlanFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPlanFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPlanFindFirstArgs>(args?: SelectSubset<T, SubscriptionPlanFindFirstArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
     * 
     * // Get first 10 SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionPlanFindManyArgs>(args?: SelectSubset<T, SubscriptionPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionPlan.
     * @param {SubscriptionPlanCreateArgs} args - Arguments to create a SubscriptionPlan.
     * @example
     * // Create one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.create({
     *   data: {
     *     // ... data to create a SubscriptionPlan
     *   }
     * })
     * 
     */
    create<T extends SubscriptionPlanCreateArgs>(args: SelectSubset<T, SubscriptionPlanCreateArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionPlans.
     * @param {SubscriptionPlanCreateManyArgs} args - Arguments to create many SubscriptionPlans.
     * @example
     * // Create many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionPlanCreateManyArgs>(args?: SelectSubset<T, SubscriptionPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionPlans and returns the data saved in the database.
     * @param {SubscriptionPlanCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPlans.
     * @example
     * // Create many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionPlans and only return the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionPlan.
     * @param {SubscriptionPlanDeleteArgs} args - Arguments to delete one SubscriptionPlan.
     * @example
     * // Delete one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPlan
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionPlanDeleteArgs>(args: SelectSubset<T, SubscriptionPlanDeleteArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionPlan.
     * @param {SubscriptionPlanUpdateArgs} args - Arguments to update one SubscriptionPlan.
     * @example
     * // Update one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionPlanUpdateArgs>(args: SelectSubset<T, SubscriptionPlanUpdateArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionPlans.
     * @param {SubscriptionPlanDeleteManyArgs} args - Arguments to filter SubscriptionPlans to delete.
     * @example
     * // Delete a few SubscriptionPlans
     * const { count } = await prisma.subscriptionPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionPlanDeleteManyArgs>(args?: SelectSubset<T, SubscriptionPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionPlanUpdateManyArgs>(args: SelectSubset<T, SubscriptionPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlans and returns the data updated in the database.
     * @param {SubscriptionPlanUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPlans.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionPlans and only return the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionPlanUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionPlan.
     * @param {SubscriptionPlanUpsertArgs} args - Arguments to update or create a SubscriptionPlan.
     * @example
     * // Update or create a SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPlan we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPlanUpsertArgs>(args: SelectSubset<T, SubscriptionPlanUpsertArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanCountArgs} args - Arguments to filter SubscriptionPlans to count.
     * @example
     * // Count the number of SubscriptionPlans
     * const count = await prisma.subscriptionPlan.count({
     *   where: {
     *     // ... the filter for the SubscriptionPlans we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPlanCountArgs>(
      args?: Subset<T, SubscriptionPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionPlanAggregateArgs>(args: Subset<T, SubscriptionPlanAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPlanAggregateType<T>>

    /**
     * Group by SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPlanGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionPlan model
   */
  readonly fields: SubscriptionPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends SubscriptionPlan$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlan$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tenants<T extends SubscriptionPlan$tenantsArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlan$tenantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubscriptionPlan model
   */
  interface SubscriptionPlanFieldRefs {
    readonly id: FieldRef<"SubscriptionPlan", 'String'>
    readonly name: FieldRef<"SubscriptionPlan", 'String'>
    readonly price: FieldRef<"SubscriptionPlan", 'Decimal'>
    readonly billingCycle: FieldRef<"SubscriptionPlan", 'BillingCycle'>
    readonly features: FieldRef<"SubscriptionPlan", 'Json'>
    readonly createdAt: FieldRef<"SubscriptionPlan", 'DateTime'>
    readonly providerPlanId: FieldRef<"SubscriptionPlan", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionPlan findUnique
   */
  export type SubscriptionPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan findUniqueOrThrow
   */
  export type SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan findFirst
   */
  export type SubscriptionPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan findFirstOrThrow
   */
  export type SubscriptionPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan findMany
   */
  export type SubscriptionPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlans to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan create
   */
  export type SubscriptionPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>
  }

  /**
   * SubscriptionPlan createMany
   */
  export type SubscriptionPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlan createManyAndReturn
   */
  export type SubscriptionPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlan update
   */
  export type SubscriptionPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPlan to update.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan updateMany
   */
  export type SubscriptionPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan updateManyAndReturn
   */
  export type SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan upsert
   */
  export type SubscriptionPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPlan to update in case it exists.
     */
    where: SubscriptionPlanWhereUniqueInput
    /**
     * In case the SubscriptionPlan found by the `where` argument doesn't exist, create a new SubscriptionPlan with this data.
     */
    create: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>
    /**
     * In case the SubscriptionPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>
  }

  /**
   * SubscriptionPlan delete
   */
  export type SubscriptionPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPlan to delete.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan deleteMany
   */
  export type SubscriptionPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlans to delete
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan.subscriptions
   */
  export type SubscriptionPlan$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    cursor?: TenantSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan.tenants
   */
  export type SubscriptionPlan$tenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    cursor?: TenantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan without action
   */
  export type SubscriptionPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
  }


  /**
   * Model TenantSubscription
   */

  export type AggregateTenantSubscription = {
    _count: TenantSubscriptionCountAggregateOutputType | null
    _min: TenantSubscriptionMinAggregateOutputType | null
    _max: TenantSubscriptionMaxAggregateOutputType | null
  }

  export type TenantSubscriptionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    status: $Enums.SubscriptionStatus | null
    provider: string | null
    providerSubscriptionId: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantSubscriptionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    status: $Enums.SubscriptionStatus | null
    provider: string | null
    providerSubscriptionId: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantSubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    planId: number
    status: number
    provider: number
    providerSubscriptionId: number
    currentPeriodStart: number
    currentPeriodEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantSubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    provider?: true
    providerSubscriptionId?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantSubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    provider?: true
    providerSubscriptionId?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantSubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    provider?: true
    providerSubscriptionId?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSubscription to aggregate.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantSubscriptions
    **/
    _count?: true | TenantSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantSubscriptionMaxAggregateInputType
  }

  export type GetTenantSubscriptionAggregateType<T extends TenantSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantSubscription[P]>
      : GetScalarType<T[P], AggregateTenantSubscription[P]>
  }




  export type TenantSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithAggregationInput | TenantSubscriptionOrderByWithAggregationInput[]
    by: TenantSubscriptionScalarFieldEnum[] | TenantSubscriptionScalarFieldEnum
    having?: TenantSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantSubscriptionCountAggregateInputType | true
    _min?: TenantSubscriptionMinAggregateInputType
    _max?: TenantSubscriptionMaxAggregateInputType
  }

  export type TenantSubscriptionGroupByOutputType = {
    id: string
    tenantId: string
    planId: string
    status: $Enums.SubscriptionStatus
    provider: string
    providerSubscriptionId: string | null
    currentPeriodStart: Date
    currentPeriodEnd: Date
    createdAt: Date
    updatedAt: Date
    _count: TenantSubscriptionCountAggregateOutputType | null
    _min: TenantSubscriptionMinAggregateOutputType | null
    _max: TenantSubscriptionMaxAggregateOutputType | null
  }

  type GetTenantSubscriptionGroupByPayload<T extends TenantSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], TenantSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type TenantSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    provider?: boolean
    providerSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    SubscriptionPayment?: boolean | TenantSubscription$SubscriptionPaymentArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    _count?: boolean | TenantSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    provider?: boolean
    providerSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    provider?: boolean
    providerSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    provider?: boolean
    providerSubscriptionId?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantSubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "planId" | "status" | "provider" | "providerSubscriptionId" | "currentPeriodStart" | "currentPeriodEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantSubscription"]>
  export type TenantSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    SubscriptionPayment?: boolean | TenantSubscription$SubscriptionPaymentArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    _count?: boolean | TenantSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantSubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantSubscription"
    objects: {
      SubscriptionPayment: Prisma.$SubscriptionPaymentPayload<ExtArgs>[]
      plan: Prisma.$SubscriptionPlanPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      planId: string
      status: $Enums.SubscriptionStatus
      provider: string
      providerSubscriptionId: string | null
      currentPeriodStart: Date
      currentPeriodEnd: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenantSubscription"]>
    composites: {}
  }

  type TenantSubscriptionGetPayload<S extends boolean | null | undefined | TenantSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$TenantSubscriptionPayload, S>

  type TenantSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantSubscriptionCountAggregateInputType | true
    }

  export interface TenantSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantSubscription'], meta: { name: 'TenantSubscription' } }
    /**
     * Find zero or one TenantSubscription that matches the filter.
     * @param {TenantSubscriptionFindUniqueArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantSubscriptionFindUniqueArgs>(args: SelectSubset<T, TenantSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindFirstArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantSubscriptionFindFirstArgs>(args?: SelectSubset<T, TenantSubscriptionFindFirstArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindFirstOrThrowArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantSubscriptions
     * const tenantSubscriptions = await prisma.tenantSubscription.findMany()
     * 
     * // Get first 10 TenantSubscriptions
     * const tenantSubscriptions = await prisma.tenantSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantSubscriptionFindManyArgs>(args?: SelectSubset<T, TenantSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantSubscription.
     * @param {TenantSubscriptionCreateArgs} args - Arguments to create a TenantSubscription.
     * @example
     * // Create one TenantSubscription
     * const TenantSubscription = await prisma.tenantSubscription.create({
     *   data: {
     *     // ... data to create a TenantSubscription
     *   }
     * })
     * 
     */
    create<T extends TenantSubscriptionCreateArgs>(args: SelectSubset<T, TenantSubscriptionCreateArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantSubscriptions.
     * @param {TenantSubscriptionCreateManyArgs} args - Arguments to create many TenantSubscriptions.
     * @example
     * // Create many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantSubscriptionCreateManyArgs>(args?: SelectSubset<T, TenantSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantSubscriptions and returns the data saved in the database.
     * @param {TenantSubscriptionCreateManyAndReturnArgs} args - Arguments to create many TenantSubscriptions.
     * @example
     * // Create many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantSubscriptions and only return the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantSubscription.
     * @param {TenantSubscriptionDeleteArgs} args - Arguments to delete one TenantSubscription.
     * @example
     * // Delete one TenantSubscription
     * const TenantSubscription = await prisma.tenantSubscription.delete({
     *   where: {
     *     // ... filter to delete one TenantSubscription
     *   }
     * })
     * 
     */
    delete<T extends TenantSubscriptionDeleteArgs>(args: SelectSubset<T, TenantSubscriptionDeleteArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantSubscription.
     * @param {TenantSubscriptionUpdateArgs} args - Arguments to update one TenantSubscription.
     * @example
     * // Update one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantSubscriptionUpdateArgs>(args: SelectSubset<T, TenantSubscriptionUpdateArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantSubscriptions.
     * @param {TenantSubscriptionDeleteManyArgs} args - Arguments to filter TenantSubscriptions to delete.
     * @example
     * // Delete a few TenantSubscriptions
     * const { count } = await prisma.tenantSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantSubscriptionDeleteManyArgs>(args?: SelectSubset<T, TenantSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantSubscriptionUpdateManyArgs>(args: SelectSubset<T, TenantSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantSubscriptions and returns the data updated in the database.
     * @param {TenantSubscriptionUpdateManyAndReturnArgs} args - Arguments to update many TenantSubscriptions.
     * @example
     * // Update many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantSubscriptions and only return the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantSubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantSubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantSubscription.
     * @param {TenantSubscriptionUpsertArgs} args - Arguments to update or create a TenantSubscription.
     * @example
     * // Update or create a TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.upsert({
     *   create: {
     *     // ... data to create a TenantSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantSubscription we want to update
     *   }
     * })
     */
    upsert<T extends TenantSubscriptionUpsertArgs>(args: SelectSubset<T, TenantSubscriptionUpsertArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionCountArgs} args - Arguments to filter TenantSubscriptions to count.
     * @example
     * // Count the number of TenantSubscriptions
     * const count = await prisma.tenantSubscription.count({
     *   where: {
     *     // ... the filter for the TenantSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends TenantSubscriptionCountArgs>(
      args?: Subset<T, TenantSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantSubscriptionAggregateArgs>(args: Subset<T, TenantSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetTenantSubscriptionAggregateType<T>>

    /**
     * Group by TenantSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: TenantSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantSubscription model
   */
  readonly fields: TenantSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    SubscriptionPayment<T extends TenantSubscription$SubscriptionPaymentArgs<ExtArgs> = {}>(args?: Subset<T, TenantSubscription$SubscriptionPaymentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    plan<T extends SubscriptionPlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlanDefaultArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantSubscription model
   */
  interface TenantSubscriptionFieldRefs {
    readonly id: FieldRef<"TenantSubscription", 'String'>
    readonly tenantId: FieldRef<"TenantSubscription", 'String'>
    readonly planId: FieldRef<"TenantSubscription", 'String'>
    readonly status: FieldRef<"TenantSubscription", 'SubscriptionStatus'>
    readonly provider: FieldRef<"TenantSubscription", 'String'>
    readonly providerSubscriptionId: FieldRef<"TenantSubscription", 'String'>
    readonly currentPeriodStart: FieldRef<"TenantSubscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"TenantSubscription", 'DateTime'>
    readonly createdAt: FieldRef<"TenantSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantSubscription findUnique
   */
  export type TenantSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription findUniqueOrThrow
   */
  export type TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription findFirst
   */
  export type TenantSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSubscriptions.
     */
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription findFirstOrThrow
   */
  export type TenantSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSubscriptions.
     */
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription findMany
   */
  export type TenantSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscriptions to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription create
   */
  export type TenantSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantSubscription.
     */
    data: XOR<TenantSubscriptionCreateInput, TenantSubscriptionUncheckedCreateInput>
  }

  /**
   * TenantSubscription createMany
   */
  export type TenantSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantSubscriptions.
     */
    data: TenantSubscriptionCreateManyInput | TenantSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantSubscription createManyAndReturn
   */
  export type TenantSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many TenantSubscriptions.
     */
    data: TenantSubscriptionCreateManyInput | TenantSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantSubscription update
   */
  export type TenantSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantSubscription.
     */
    data: XOR<TenantSubscriptionUpdateInput, TenantSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which TenantSubscription to update.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription updateMany
   */
  export type TenantSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantSubscriptions.
     */
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which TenantSubscriptions to update
     */
    where?: TenantSubscriptionWhereInput
    /**
     * Limit how many TenantSubscriptions to update.
     */
    limit?: number
  }

  /**
   * TenantSubscription updateManyAndReturn
   */
  export type TenantSubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update TenantSubscriptions.
     */
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which TenantSubscriptions to update
     */
    where?: TenantSubscriptionWhereInput
    /**
     * Limit how many TenantSubscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantSubscription upsert
   */
  export type TenantSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantSubscription to update in case it exists.
     */
    where: TenantSubscriptionWhereUniqueInput
    /**
     * In case the TenantSubscription found by the `where` argument doesn't exist, create a new TenantSubscription with this data.
     */
    create: XOR<TenantSubscriptionCreateInput, TenantSubscriptionUncheckedCreateInput>
    /**
     * In case the TenantSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantSubscriptionUpdateInput, TenantSubscriptionUncheckedUpdateInput>
  }

  /**
   * TenantSubscription delete
   */
  export type TenantSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which TenantSubscription to delete.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription deleteMany
   */
  export type TenantSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSubscriptions to delete
     */
    where?: TenantSubscriptionWhereInput
    /**
     * Limit how many TenantSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * TenantSubscription.SubscriptionPayment
   */
  export type TenantSubscription$SubscriptionPaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    where?: SubscriptionPaymentWhereInput
    orderBy?: SubscriptionPaymentOrderByWithRelationInput | SubscriptionPaymentOrderByWithRelationInput[]
    cursor?: SubscriptionPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionPaymentScalarFieldEnum | SubscriptionPaymentScalarFieldEnum[]
  }

  /**
   * TenantSubscription without action
   */
  export type TenantSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model SubscriptionPayment
   */

  export type AggregateSubscriptionPayment = {
    _count: SubscriptionPaymentCountAggregateOutputType | null
    _avg: SubscriptionPaymentAvgAggregateOutputType | null
    _sum: SubscriptionPaymentSumAggregateOutputType | null
    _min: SubscriptionPaymentMinAggregateOutputType | null
    _max: SubscriptionPaymentMaxAggregateOutputType | null
  }

  export type SubscriptionPaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type SubscriptionPaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type SubscriptionPaymentMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    amount: Decimal | null
    currency: string | null
    status: string | null
    provider: string | null
    providerTransactionId: string | null
    subscriptionId: string | null
    createdAt: Date | null
  }

  export type SubscriptionPaymentMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    amount: Decimal | null
    currency: string | null
    status: string | null
    provider: string | null
    providerTransactionId: string | null
    subscriptionId: string | null
    createdAt: Date | null
  }

  export type SubscriptionPaymentCountAggregateOutputType = {
    id: number
    tenantId: number
    amount: number
    currency: number
    status: number
    provider: number
    providerTransactionId: number
    subscriptionId: number
    createdAt: number
    _all: number
  }


  export type SubscriptionPaymentAvgAggregateInputType = {
    amount?: true
  }

  export type SubscriptionPaymentSumAggregateInputType = {
    amount?: true
  }

  export type SubscriptionPaymentMinAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    currency?: true
    status?: true
    provider?: true
    providerTransactionId?: true
    subscriptionId?: true
    createdAt?: true
  }

  export type SubscriptionPaymentMaxAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    currency?: true
    status?: true
    provider?: true
    providerTransactionId?: true
    subscriptionId?: true
    createdAt?: true
  }

  export type SubscriptionPaymentCountAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    currency?: true
    status?: true
    provider?: true
    providerTransactionId?: true
    subscriptionId?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionPaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPayment to aggregate.
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPayments to fetch.
     */
    orderBy?: SubscriptionPaymentOrderByWithRelationInput | SubscriptionPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPayments
    **/
    _count?: true | SubscriptionPaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPaymentMaxAggregateInputType
  }

  export type GetSubscriptionPaymentAggregateType<T extends SubscriptionPaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPayment[P]>
      : GetScalarType<T[P], AggregateSubscriptionPayment[P]>
  }




  export type SubscriptionPaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPaymentWhereInput
    orderBy?: SubscriptionPaymentOrderByWithAggregationInput | SubscriptionPaymentOrderByWithAggregationInput[]
    by: SubscriptionPaymentScalarFieldEnum[] | SubscriptionPaymentScalarFieldEnum
    having?: SubscriptionPaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPaymentCountAggregateInputType | true
    _avg?: SubscriptionPaymentAvgAggregateInputType
    _sum?: SubscriptionPaymentSumAggregateInputType
    _min?: SubscriptionPaymentMinAggregateInputType
    _max?: SubscriptionPaymentMaxAggregateInputType
  }

  export type SubscriptionPaymentGroupByOutputType = {
    id: string
    tenantId: string
    amount: Decimal
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    subscriptionId: string
    createdAt: Date
    _count: SubscriptionPaymentCountAggregateOutputType | null
    _avg: SubscriptionPaymentAvgAggregateOutputType | null
    _sum: SubscriptionPaymentSumAggregateOutputType | null
    _min: SubscriptionPaymentMinAggregateOutputType | null
    _max: SubscriptionPaymentMaxAggregateOutputType | null
  }

  type GetSubscriptionPaymentGroupByPayload<T extends SubscriptionPaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPaymentGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPaymentGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPayment"]>

  export type SubscriptionPaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPayment"]>

  export type SubscriptionPaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPayment"]>

  export type SubscriptionPaymentSelectScalar = {
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    provider?: boolean
    providerTransactionId?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
  }

  export type SubscriptionPaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "amount" | "currency" | "status" | "provider" | "providerTransactionId" | "subscriptionId" | "createdAt", ExtArgs["result"]["subscriptionPayment"]>
  export type SubscriptionPaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SubscriptionPaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SubscriptionPaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionPayment"
    objects: {
      subscription: Prisma.$TenantSubscriptionPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      amount: Prisma.Decimal
      currency: string
      status: string
      provider: string
      providerTransactionId: string
      subscriptionId: string
      createdAt: Date
    }, ExtArgs["result"]["subscriptionPayment"]>
    composites: {}
  }

  type SubscriptionPaymentGetPayload<S extends boolean | null | undefined | SubscriptionPaymentDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPaymentPayload, S>

  type SubscriptionPaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionPaymentCountAggregateInputType | true
    }

  export interface SubscriptionPaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPayment'], meta: { name: 'SubscriptionPayment' } }
    /**
     * Find zero or one SubscriptionPayment that matches the filter.
     * @param {SubscriptionPaymentFindUniqueArgs} args - Arguments to find a SubscriptionPayment
     * @example
     * // Get one SubscriptionPayment
     * const subscriptionPayment = await prisma.subscriptionPayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPaymentFindUniqueArgs>(args: SelectSubset<T, SubscriptionPaymentFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionPayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPaymentFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPayment
     * @example
     * // Get one SubscriptionPayment
     * const subscriptionPayment = await prisma.subscriptionPayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentFindFirstArgs} args - Arguments to find a SubscriptionPayment
     * @example
     * // Get one SubscriptionPayment
     * const subscriptionPayment = await prisma.subscriptionPayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPaymentFindFirstArgs>(args?: SelectSubset<T, SubscriptionPaymentFindFirstArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPayment
     * @example
     * // Get one SubscriptionPayment
     * const subscriptionPayment = await prisma.subscriptionPayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionPayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPayments
     * const subscriptionPayments = await prisma.subscriptionPayment.findMany()
     * 
     * // Get first 10 SubscriptionPayments
     * const subscriptionPayments = await prisma.subscriptionPayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPaymentWithIdOnly = await prisma.subscriptionPayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionPaymentFindManyArgs>(args?: SelectSubset<T, SubscriptionPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionPayment.
     * @param {SubscriptionPaymentCreateArgs} args - Arguments to create a SubscriptionPayment.
     * @example
     * // Create one SubscriptionPayment
     * const SubscriptionPayment = await prisma.subscriptionPayment.create({
     *   data: {
     *     // ... data to create a SubscriptionPayment
     *   }
     * })
     * 
     */
    create<T extends SubscriptionPaymentCreateArgs>(args: SelectSubset<T, SubscriptionPaymentCreateArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionPayments.
     * @param {SubscriptionPaymentCreateManyArgs} args - Arguments to create many SubscriptionPayments.
     * @example
     * // Create many SubscriptionPayments
     * const subscriptionPayment = await prisma.subscriptionPayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionPaymentCreateManyArgs>(args?: SelectSubset<T, SubscriptionPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionPayments and returns the data saved in the database.
     * @param {SubscriptionPaymentCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPayments.
     * @example
     * // Create many SubscriptionPayments
     * const subscriptionPayment = await prisma.subscriptionPayment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionPayments and only return the `id`
     * const subscriptionPaymentWithIdOnly = await prisma.subscriptionPayment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionPaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionPayment.
     * @param {SubscriptionPaymentDeleteArgs} args - Arguments to delete one SubscriptionPayment.
     * @example
     * // Delete one SubscriptionPayment
     * const SubscriptionPayment = await prisma.subscriptionPayment.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPayment
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionPaymentDeleteArgs>(args: SelectSubset<T, SubscriptionPaymentDeleteArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionPayment.
     * @param {SubscriptionPaymentUpdateArgs} args - Arguments to update one SubscriptionPayment.
     * @example
     * // Update one SubscriptionPayment
     * const subscriptionPayment = await prisma.subscriptionPayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionPaymentUpdateArgs>(args: SelectSubset<T, SubscriptionPaymentUpdateArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionPayments.
     * @param {SubscriptionPaymentDeleteManyArgs} args - Arguments to filter SubscriptionPayments to delete.
     * @example
     * // Delete a few SubscriptionPayments
     * const { count } = await prisma.subscriptionPayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionPaymentDeleteManyArgs>(args?: SelectSubset<T, SubscriptionPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPayments
     * const subscriptionPayment = await prisma.subscriptionPayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionPaymentUpdateManyArgs>(args: SelectSubset<T, SubscriptionPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPayments and returns the data updated in the database.
     * @param {SubscriptionPaymentUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPayments.
     * @example
     * // Update many SubscriptionPayments
     * const subscriptionPayment = await prisma.subscriptionPayment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionPayments and only return the `id`
     * const subscriptionPaymentWithIdOnly = await prisma.subscriptionPayment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionPaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionPayment.
     * @param {SubscriptionPaymentUpsertArgs} args - Arguments to update or create a SubscriptionPayment.
     * @example
     * // Update or create a SubscriptionPayment
     * const subscriptionPayment = await prisma.subscriptionPayment.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPayment we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPaymentUpsertArgs>(args: SelectSubset<T, SubscriptionPaymentUpsertArgs<ExtArgs>>): Prisma__SubscriptionPaymentClient<$Result.GetResult<Prisma.$SubscriptionPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentCountArgs} args - Arguments to filter SubscriptionPayments to count.
     * @example
     * // Count the number of SubscriptionPayments
     * const count = await prisma.subscriptionPayment.count({
     *   where: {
     *     // ... the filter for the SubscriptionPayments we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPaymentCountArgs>(
      args?: Subset<T, SubscriptionPaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionPaymentAggregateArgs>(args: Subset<T, SubscriptionPaymentAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPaymentAggregateType<T>>

    /**
     * Group by SubscriptionPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionPaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPaymentGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionPayment model
   */
  readonly fields: SubscriptionPaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscription<T extends TenantSubscriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantSubscriptionDefaultArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubscriptionPayment model
   */
  interface SubscriptionPaymentFieldRefs {
    readonly id: FieldRef<"SubscriptionPayment", 'String'>
    readonly tenantId: FieldRef<"SubscriptionPayment", 'String'>
    readonly amount: FieldRef<"SubscriptionPayment", 'Decimal'>
    readonly currency: FieldRef<"SubscriptionPayment", 'String'>
    readonly status: FieldRef<"SubscriptionPayment", 'String'>
    readonly provider: FieldRef<"SubscriptionPayment", 'String'>
    readonly providerTransactionId: FieldRef<"SubscriptionPayment", 'String'>
    readonly subscriptionId: FieldRef<"SubscriptionPayment", 'String'>
    readonly createdAt: FieldRef<"SubscriptionPayment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionPayment findUnique
   */
  export type SubscriptionPaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPayment to fetch.
     */
    where: SubscriptionPaymentWhereUniqueInput
  }

  /**
   * SubscriptionPayment findUniqueOrThrow
   */
  export type SubscriptionPaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPayment to fetch.
     */
    where: SubscriptionPaymentWhereUniqueInput
  }

  /**
   * SubscriptionPayment findFirst
   */
  export type SubscriptionPaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPayment to fetch.
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPayments to fetch.
     */
    orderBy?: SubscriptionPaymentOrderByWithRelationInput | SubscriptionPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPayments.
     */
    cursor?: SubscriptionPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPayments.
     */
    distinct?: SubscriptionPaymentScalarFieldEnum | SubscriptionPaymentScalarFieldEnum[]
  }

  /**
   * SubscriptionPayment findFirstOrThrow
   */
  export type SubscriptionPaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPayment to fetch.
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPayments to fetch.
     */
    orderBy?: SubscriptionPaymentOrderByWithRelationInput | SubscriptionPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPayments.
     */
    cursor?: SubscriptionPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPayments.
     */
    distinct?: SubscriptionPaymentScalarFieldEnum | SubscriptionPaymentScalarFieldEnum[]
  }

  /**
   * SubscriptionPayment findMany
   */
  export type SubscriptionPaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPayments to fetch.
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPayments to fetch.
     */
    orderBy?: SubscriptionPaymentOrderByWithRelationInput | SubscriptionPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPayments.
     */
    cursor?: SubscriptionPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPayments.
     */
    skip?: number
    distinct?: SubscriptionPaymentScalarFieldEnum | SubscriptionPaymentScalarFieldEnum[]
  }

  /**
   * SubscriptionPayment create
   */
  export type SubscriptionPaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPayment.
     */
    data: XOR<SubscriptionPaymentCreateInput, SubscriptionPaymentUncheckedCreateInput>
  }

  /**
   * SubscriptionPayment createMany
   */
  export type SubscriptionPaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPayments.
     */
    data: SubscriptionPaymentCreateManyInput | SubscriptionPaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPayment createManyAndReturn
   */
  export type SubscriptionPaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionPayments.
     */
    data: SubscriptionPaymentCreateManyInput | SubscriptionPaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubscriptionPayment update
   */
  export type SubscriptionPaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPayment.
     */
    data: XOR<SubscriptionPaymentUpdateInput, SubscriptionPaymentUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPayment to update.
     */
    where: SubscriptionPaymentWhereUniqueInput
  }

  /**
   * SubscriptionPayment updateMany
   */
  export type SubscriptionPaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPayments.
     */
    data: XOR<SubscriptionPaymentUpdateManyMutationInput, SubscriptionPaymentUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPayments to update
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * Limit how many SubscriptionPayments to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPayment updateManyAndReturn
   */
  export type SubscriptionPaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionPayments.
     */
    data: XOR<SubscriptionPaymentUpdateManyMutationInput, SubscriptionPaymentUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPayments to update
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * Limit how many SubscriptionPayments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubscriptionPayment upsert
   */
  export type SubscriptionPaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPayment to update in case it exists.
     */
    where: SubscriptionPaymentWhereUniqueInput
    /**
     * In case the SubscriptionPayment found by the `where` argument doesn't exist, create a new SubscriptionPayment with this data.
     */
    create: XOR<SubscriptionPaymentCreateInput, SubscriptionPaymentUncheckedCreateInput>
    /**
     * In case the SubscriptionPayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPaymentUpdateInput, SubscriptionPaymentUncheckedUpdateInput>
  }

  /**
   * SubscriptionPayment delete
   */
  export type SubscriptionPaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPayment to delete.
     */
    where: SubscriptionPaymentWhereUniqueInput
  }

  /**
   * SubscriptionPayment deleteMany
   */
  export type SubscriptionPaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPayments to delete
     */
    where?: SubscriptionPaymentWhereInput
    /**
     * Limit how many SubscriptionPayments to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionPayment without action
   */
  export type SubscriptionPaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPayment
     */
    select?: SubscriptionPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPayment
     */
    omit?: SubscriptionPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPaymentInclude<ExtArgs> | null
  }


  /**
   * Model PaymentIndex
   */

  export type AggregatePaymentIndex = {
    _count: PaymentIndexCountAggregateOutputType | null
    _min: PaymentIndexMinAggregateOutputType | null
    _max: PaymentIndexMaxAggregateOutputType | null
  }

  export type PaymentIndexMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    orderId: string | null
    checkoutRequestId: string | null
    createdAt: Date | null
  }

  export type PaymentIndexMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    orderId: string | null
    checkoutRequestId: string | null
    createdAt: Date | null
  }

  export type PaymentIndexCountAggregateOutputType = {
    id: number
    tenantId: number
    orderId: number
    checkoutRequestId: number
    createdAt: number
    _all: number
  }


  export type PaymentIndexMinAggregateInputType = {
    id?: true
    tenantId?: true
    orderId?: true
    checkoutRequestId?: true
    createdAt?: true
  }

  export type PaymentIndexMaxAggregateInputType = {
    id?: true
    tenantId?: true
    orderId?: true
    checkoutRequestId?: true
    createdAt?: true
  }

  export type PaymentIndexCountAggregateInputType = {
    id?: true
    tenantId?: true
    orderId?: true
    checkoutRequestId?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentIndexAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentIndex to aggregate.
     */
    where?: PaymentIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentIndices to fetch.
     */
    orderBy?: PaymentIndexOrderByWithRelationInput | PaymentIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentIndices
    **/
    _count?: true | PaymentIndexCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentIndexMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentIndexMaxAggregateInputType
  }

  export type GetPaymentIndexAggregateType<T extends PaymentIndexAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentIndex]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentIndex[P]>
      : GetScalarType<T[P], AggregatePaymentIndex[P]>
  }




  export type PaymentIndexGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentIndexWhereInput
    orderBy?: PaymentIndexOrderByWithAggregationInput | PaymentIndexOrderByWithAggregationInput[]
    by: PaymentIndexScalarFieldEnum[] | PaymentIndexScalarFieldEnum
    having?: PaymentIndexScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentIndexCountAggregateInputType | true
    _min?: PaymentIndexMinAggregateInputType
    _max?: PaymentIndexMaxAggregateInputType
  }

  export type PaymentIndexGroupByOutputType = {
    id: string
    tenantId: string
    orderId: string
    checkoutRequestId: string
    createdAt: Date
    _count: PaymentIndexCountAggregateOutputType | null
    _min: PaymentIndexMinAggregateOutputType | null
    _max: PaymentIndexMaxAggregateOutputType | null
  }

  type GetPaymentIndexGroupByPayload<T extends PaymentIndexGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentIndexGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentIndexGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentIndexGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentIndexGroupByOutputType[P]>
        }
      >
    >


  export type PaymentIndexSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    orderId?: boolean
    checkoutRequestId?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentIndex"]>

  export type PaymentIndexSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    orderId?: boolean
    checkoutRequestId?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentIndex"]>

  export type PaymentIndexSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    orderId?: boolean
    checkoutRequestId?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentIndex"]>

  export type PaymentIndexSelectScalar = {
    id?: boolean
    tenantId?: boolean
    orderId?: boolean
    checkoutRequestId?: boolean
    createdAt?: boolean
  }

  export type PaymentIndexOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "orderId" | "checkoutRequestId" | "createdAt", ExtArgs["result"]["paymentIndex"]>
  export type PaymentIndexInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type PaymentIndexIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type PaymentIndexIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $PaymentIndexPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentIndex"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      orderId: string
      checkoutRequestId: string
      createdAt: Date
    }, ExtArgs["result"]["paymentIndex"]>
    composites: {}
  }

  type PaymentIndexGetPayload<S extends boolean | null | undefined | PaymentIndexDefaultArgs> = $Result.GetResult<Prisma.$PaymentIndexPayload, S>

  type PaymentIndexCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentIndexFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentIndexCountAggregateInputType | true
    }

  export interface PaymentIndexDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentIndex'], meta: { name: 'PaymentIndex' } }
    /**
     * Find zero or one PaymentIndex that matches the filter.
     * @param {PaymentIndexFindUniqueArgs} args - Arguments to find a PaymentIndex
     * @example
     * // Get one PaymentIndex
     * const paymentIndex = await prisma.paymentIndex.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentIndexFindUniqueArgs>(args: SelectSubset<T, PaymentIndexFindUniqueArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentIndex that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentIndexFindUniqueOrThrowArgs} args - Arguments to find a PaymentIndex
     * @example
     * // Get one PaymentIndex
     * const paymentIndex = await prisma.paymentIndex.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentIndexFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentIndexFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentIndex that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexFindFirstArgs} args - Arguments to find a PaymentIndex
     * @example
     * // Get one PaymentIndex
     * const paymentIndex = await prisma.paymentIndex.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentIndexFindFirstArgs>(args?: SelectSubset<T, PaymentIndexFindFirstArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentIndex that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexFindFirstOrThrowArgs} args - Arguments to find a PaymentIndex
     * @example
     * // Get one PaymentIndex
     * const paymentIndex = await prisma.paymentIndex.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentIndexFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentIndexFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentIndices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentIndices
     * const paymentIndices = await prisma.paymentIndex.findMany()
     * 
     * // Get first 10 PaymentIndices
     * const paymentIndices = await prisma.paymentIndex.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentIndexWithIdOnly = await prisma.paymentIndex.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentIndexFindManyArgs>(args?: SelectSubset<T, PaymentIndexFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentIndex.
     * @param {PaymentIndexCreateArgs} args - Arguments to create a PaymentIndex.
     * @example
     * // Create one PaymentIndex
     * const PaymentIndex = await prisma.paymentIndex.create({
     *   data: {
     *     // ... data to create a PaymentIndex
     *   }
     * })
     * 
     */
    create<T extends PaymentIndexCreateArgs>(args: SelectSubset<T, PaymentIndexCreateArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentIndices.
     * @param {PaymentIndexCreateManyArgs} args - Arguments to create many PaymentIndices.
     * @example
     * // Create many PaymentIndices
     * const paymentIndex = await prisma.paymentIndex.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentIndexCreateManyArgs>(args?: SelectSubset<T, PaymentIndexCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentIndices and returns the data saved in the database.
     * @param {PaymentIndexCreateManyAndReturnArgs} args - Arguments to create many PaymentIndices.
     * @example
     * // Create many PaymentIndices
     * const paymentIndex = await prisma.paymentIndex.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentIndices and only return the `id`
     * const paymentIndexWithIdOnly = await prisma.paymentIndex.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentIndexCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentIndexCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PaymentIndex.
     * @param {PaymentIndexDeleteArgs} args - Arguments to delete one PaymentIndex.
     * @example
     * // Delete one PaymentIndex
     * const PaymentIndex = await prisma.paymentIndex.delete({
     *   where: {
     *     // ... filter to delete one PaymentIndex
     *   }
     * })
     * 
     */
    delete<T extends PaymentIndexDeleteArgs>(args: SelectSubset<T, PaymentIndexDeleteArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentIndex.
     * @param {PaymentIndexUpdateArgs} args - Arguments to update one PaymentIndex.
     * @example
     * // Update one PaymentIndex
     * const paymentIndex = await prisma.paymentIndex.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentIndexUpdateArgs>(args: SelectSubset<T, PaymentIndexUpdateArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentIndices.
     * @param {PaymentIndexDeleteManyArgs} args - Arguments to filter PaymentIndices to delete.
     * @example
     * // Delete a few PaymentIndices
     * const { count } = await prisma.paymentIndex.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentIndexDeleteManyArgs>(args?: SelectSubset<T, PaymentIndexDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentIndices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentIndices
     * const paymentIndex = await prisma.paymentIndex.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentIndexUpdateManyArgs>(args: SelectSubset<T, PaymentIndexUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentIndices and returns the data updated in the database.
     * @param {PaymentIndexUpdateManyAndReturnArgs} args - Arguments to update many PaymentIndices.
     * @example
     * // Update many PaymentIndices
     * const paymentIndex = await prisma.paymentIndex.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PaymentIndices and only return the `id`
     * const paymentIndexWithIdOnly = await prisma.paymentIndex.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentIndexUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentIndexUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PaymentIndex.
     * @param {PaymentIndexUpsertArgs} args - Arguments to update or create a PaymentIndex.
     * @example
     * // Update or create a PaymentIndex
     * const paymentIndex = await prisma.paymentIndex.upsert({
     *   create: {
     *     // ... data to create a PaymentIndex
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentIndex we want to update
     *   }
     * })
     */
    upsert<T extends PaymentIndexUpsertArgs>(args: SelectSubset<T, PaymentIndexUpsertArgs<ExtArgs>>): Prisma__PaymentIndexClient<$Result.GetResult<Prisma.$PaymentIndexPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentIndices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexCountArgs} args - Arguments to filter PaymentIndices to count.
     * @example
     * // Count the number of PaymentIndices
     * const count = await prisma.paymentIndex.count({
     *   where: {
     *     // ... the filter for the PaymentIndices we want to count
     *   }
     * })
    **/
    count<T extends PaymentIndexCountArgs>(
      args?: Subset<T, PaymentIndexCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentIndexCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentIndex.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentIndexAggregateArgs>(args: Subset<T, PaymentIndexAggregateArgs>): Prisma.PrismaPromise<GetPaymentIndexAggregateType<T>>

    /**
     * Group by PaymentIndex.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentIndexGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentIndexGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentIndexGroupByArgs['orderBy'] }
        : { orderBy?: PaymentIndexGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentIndexGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentIndexGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentIndex model
   */
  readonly fields: PaymentIndexFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentIndex.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentIndexClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentIndex model
   */
  interface PaymentIndexFieldRefs {
    readonly id: FieldRef<"PaymentIndex", 'String'>
    readonly tenantId: FieldRef<"PaymentIndex", 'String'>
    readonly orderId: FieldRef<"PaymentIndex", 'String'>
    readonly checkoutRequestId: FieldRef<"PaymentIndex", 'String'>
    readonly createdAt: FieldRef<"PaymentIndex", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentIndex findUnique
   */
  export type PaymentIndexFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * Filter, which PaymentIndex to fetch.
     */
    where: PaymentIndexWhereUniqueInput
  }

  /**
   * PaymentIndex findUniqueOrThrow
   */
  export type PaymentIndexFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * Filter, which PaymentIndex to fetch.
     */
    where: PaymentIndexWhereUniqueInput
  }

  /**
   * PaymentIndex findFirst
   */
  export type PaymentIndexFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * Filter, which PaymentIndex to fetch.
     */
    where?: PaymentIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentIndices to fetch.
     */
    orderBy?: PaymentIndexOrderByWithRelationInput | PaymentIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentIndices.
     */
    cursor?: PaymentIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentIndices.
     */
    distinct?: PaymentIndexScalarFieldEnum | PaymentIndexScalarFieldEnum[]
  }

  /**
   * PaymentIndex findFirstOrThrow
   */
  export type PaymentIndexFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * Filter, which PaymentIndex to fetch.
     */
    where?: PaymentIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentIndices to fetch.
     */
    orderBy?: PaymentIndexOrderByWithRelationInput | PaymentIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentIndices.
     */
    cursor?: PaymentIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentIndices.
     */
    distinct?: PaymentIndexScalarFieldEnum | PaymentIndexScalarFieldEnum[]
  }

  /**
   * PaymentIndex findMany
   */
  export type PaymentIndexFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * Filter, which PaymentIndices to fetch.
     */
    where?: PaymentIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentIndices to fetch.
     */
    orderBy?: PaymentIndexOrderByWithRelationInput | PaymentIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentIndices.
     */
    cursor?: PaymentIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentIndices.
     */
    skip?: number
    distinct?: PaymentIndexScalarFieldEnum | PaymentIndexScalarFieldEnum[]
  }

  /**
   * PaymentIndex create
   */
  export type PaymentIndexCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentIndex.
     */
    data: XOR<PaymentIndexCreateInput, PaymentIndexUncheckedCreateInput>
  }

  /**
   * PaymentIndex createMany
   */
  export type PaymentIndexCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentIndices.
     */
    data: PaymentIndexCreateManyInput | PaymentIndexCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentIndex createManyAndReturn
   */
  export type PaymentIndexCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * The data used to create many PaymentIndices.
     */
    data: PaymentIndexCreateManyInput | PaymentIndexCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentIndex update
   */
  export type PaymentIndexUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentIndex.
     */
    data: XOR<PaymentIndexUpdateInput, PaymentIndexUncheckedUpdateInput>
    /**
     * Choose, which PaymentIndex to update.
     */
    where: PaymentIndexWhereUniqueInput
  }

  /**
   * PaymentIndex updateMany
   */
  export type PaymentIndexUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentIndices.
     */
    data: XOR<PaymentIndexUpdateManyMutationInput, PaymentIndexUncheckedUpdateManyInput>
    /**
     * Filter which PaymentIndices to update
     */
    where?: PaymentIndexWhereInput
    /**
     * Limit how many PaymentIndices to update.
     */
    limit?: number
  }

  /**
   * PaymentIndex updateManyAndReturn
   */
  export type PaymentIndexUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * The data used to update PaymentIndices.
     */
    data: XOR<PaymentIndexUpdateManyMutationInput, PaymentIndexUncheckedUpdateManyInput>
    /**
     * Filter which PaymentIndices to update
     */
    where?: PaymentIndexWhereInput
    /**
     * Limit how many PaymentIndices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentIndex upsert
   */
  export type PaymentIndexUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentIndex to update in case it exists.
     */
    where: PaymentIndexWhereUniqueInput
    /**
     * In case the PaymentIndex found by the `where` argument doesn't exist, create a new PaymentIndex with this data.
     */
    create: XOR<PaymentIndexCreateInput, PaymentIndexUncheckedCreateInput>
    /**
     * In case the PaymentIndex was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentIndexUpdateInput, PaymentIndexUncheckedUpdateInput>
  }

  /**
   * PaymentIndex delete
   */
  export type PaymentIndexDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
    /**
     * Filter which PaymentIndex to delete.
     */
    where: PaymentIndexWhereUniqueInput
  }

  /**
   * PaymentIndex deleteMany
   */
  export type PaymentIndexDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentIndices to delete
     */
    where?: PaymentIndexWhereInput
    /**
     * Limit how many PaymentIndices to delete.
     */
    limit?: number
  }

  /**
   * PaymentIndex without action
   */
  export type PaymentIndexDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentIndex
     */
    select?: PaymentIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentIndex
     */
    omit?: PaymentIndexOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIndexInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    subdomain: 'subdomain',
    customDomain: 'customDomain',
    dbSchema: 'dbSchema',
    status: 'status',
    suspendedAt: 'suspendedAt',
    deletedAt: 'deletedAt',
    ownerId: 'ownerId',
    planId: 'planId',
    settings: 'settings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    stripeCustomerId: 'stripeCustomerId'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    hashedPassword: 'hashedPassword',
    firstName: 'firstName',
    lastName: 'lastName',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    familyId: 'familyId',
    parentTokenId: 'parentTokenId',
    revoked: 'revoked',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const SubscriptionPlanScalarFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    billingCycle: 'billingCycle',
    features: 'features',
    createdAt: 'createdAt',
    providerPlanId: 'providerPlanId'
  };

  export type SubscriptionPlanScalarFieldEnum = (typeof SubscriptionPlanScalarFieldEnum)[keyof typeof SubscriptionPlanScalarFieldEnum]


  export const TenantSubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    status: 'status',
    provider: 'provider',
    providerSubscriptionId: 'providerSubscriptionId',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantSubscriptionScalarFieldEnum = (typeof TenantSubscriptionScalarFieldEnum)[keyof typeof TenantSubscriptionScalarFieldEnum]


  export const SubscriptionPaymentScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    provider: 'provider',
    providerTransactionId: 'providerTransactionId',
    subscriptionId: 'subscriptionId',
    createdAt: 'createdAt'
  };

  export type SubscriptionPaymentScalarFieldEnum = (typeof SubscriptionPaymentScalarFieldEnum)[keyof typeof SubscriptionPaymentScalarFieldEnum]


  export const PaymentIndexScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    orderId: 'orderId',
    checkoutRequestId: 'checkoutRequestId',
    createdAt: 'createdAt'
  };

  export type PaymentIndexScalarFieldEnum = (typeof PaymentIndexScalarFieldEnum)[keyof typeof PaymentIndexScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'TenantStatus'
   */
  export type EnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus'>
    


  /**
   * Reference to a field of type 'TenantStatus[]'
   */
  export type ListEnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'BillingCycle'
   */
  export type EnumBillingCycleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingCycle'>
    


  /**
   * Reference to a field of type 'BillingCycle[]'
   */
  export type ListEnumBillingCycleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingCycle[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    customDomain?: StringNullableFilter<"Tenant"> | string | null
    dbSchema?: StringFilter<"Tenant"> | string
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    suspendedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    ownerId?: StringFilter<"Tenant"> | string
    planId?: StringNullableFilter<"Tenant"> | string | null
    settings?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    stripeCustomerId?: StringNullableFilter<"Tenant"> | string | null
    paymentIndices?: PaymentIndexListRelationFilter
    SubscriptionPayment?: SubscriptionPaymentListRelationFilter
    subscription?: XOR<TenantSubscriptionNullableScalarRelationFilter, TenantSubscriptionWhereInput> | null
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    plan?: XOR<SubscriptionPlanNullableScalarRelationFilter, SubscriptionPlanWhereInput> | null
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrderInput | SortOrder
    dbSchema?: SortOrder
    status?: SortOrder
    suspendedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    planId?: SortOrderInput | SortOrder
    settings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    paymentIndices?: PaymentIndexOrderByRelationAggregateInput
    SubscriptionPayment?: SubscriptionPaymentOrderByRelationAggregateInput
    subscription?: TenantSubscriptionOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    plan?: SubscriptionPlanOrderByWithRelationInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subdomain?: string
    customDomain?: string
    dbSchema?: string
    stripeCustomerId?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    suspendedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    ownerId?: StringFilter<"Tenant"> | string
    planId?: StringNullableFilter<"Tenant"> | string | null
    settings?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    paymentIndices?: PaymentIndexListRelationFilter
    SubscriptionPayment?: SubscriptionPaymentListRelationFilter
    subscription?: XOR<TenantSubscriptionNullableScalarRelationFilter, TenantSubscriptionWhereInput> | null
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    plan?: XOR<SubscriptionPlanNullableScalarRelationFilter, SubscriptionPlanWhereInput> | null
  }, "id" | "subdomain" | "customDomain" | "dbSchema" | "stripeCustomerId">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrderInput | SortOrder
    dbSchema?: SortOrder
    status?: SortOrder
    suspendedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    planId?: SortOrderInput | SortOrder
    settings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    subdomain?: StringWithAggregatesFilter<"Tenant"> | string
    customDomain?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    dbSchema?: StringWithAggregatesFilter<"Tenant"> | string
    status?: EnumTenantStatusWithAggregatesFilter<"Tenant"> | $Enums.TenantStatus
    suspendedAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    ownerId?: StringWithAggregatesFilter<"Tenant"> | string
    planId?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    settings?: JsonNullableWithAggregatesFilter<"Tenant">
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    hashedPassword?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ownedTenant?: TenantListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    hashedPassword?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownedTenant?: TenantOrderByRelationAggregateInput
    refreshTokens?: RefreshTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    hashedPassword?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ownedTenant?: TenantListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    hashedPassword?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    hashedPassword?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    ipAddress?: StringNullableFilter<"RefreshToken"> | string | null
    userAgent?: StringNullableFilter<"RefreshToken"> | string | null
    familyId?: StringNullableFilter<"RefreshToken"> | string | null
    parentTokenId?: StringNullableFilter<"RefreshToken"> | string | null
    revoked?: BoolFilter<"RefreshToken"> | boolean
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    familyId?: SortOrderInput | SortOrder
    parentTokenId?: SortOrderInput | SortOrder
    revoked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: StringFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    ipAddress?: StringNullableFilter<"RefreshToken"> | string | null
    userAgent?: StringNullableFilter<"RefreshToken"> | string | null
    familyId?: StringNullableFilter<"RefreshToken"> | string | null
    parentTokenId?: StringNullableFilter<"RefreshToken"> | string | null
    revoked?: BoolFilter<"RefreshToken"> | boolean
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    familyId?: SortOrderInput | SortOrder
    parentTokenId?: SortOrderInput | SortOrder
    revoked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: StringWithAggregatesFilter<"RefreshToken"> | string
    tokenHash?: StringWithAggregatesFilter<"RefreshToken"> | string
    ipAddress?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    familyId?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    parentTokenId?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    revoked?: BoolWithAggregatesFilter<"RefreshToken"> | boolean
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type SubscriptionPlanWhereInput = {
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    OR?: SubscriptionPlanWhereInput[]
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    id?: StringFilter<"SubscriptionPlan"> | string
    name?: StringFilter<"SubscriptionPlan"> | string
    price?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFilter<"SubscriptionPlan"> | $Enums.BillingCycle
    features?: JsonFilter<"SubscriptionPlan">
    createdAt?: DateTimeFilter<"SubscriptionPlan"> | Date | string
    providerPlanId?: StringNullableFilter<"SubscriptionPlan"> | string | null
    subscriptions?: TenantSubscriptionListRelationFilter
    tenants?: TenantListRelationFilter
  }

  export type SubscriptionPlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    billingCycle?: SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    providerPlanId?: SortOrderInput | SortOrder
    subscriptions?: TenantSubscriptionOrderByRelationAggregateInput
    tenants?: TenantOrderByRelationAggregateInput
  }

  export type SubscriptionPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    providerPlanId?: string
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    OR?: SubscriptionPlanWhereInput[]
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    name?: StringFilter<"SubscriptionPlan"> | string
    price?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFilter<"SubscriptionPlan"> | $Enums.BillingCycle
    features?: JsonFilter<"SubscriptionPlan">
    createdAt?: DateTimeFilter<"SubscriptionPlan"> | Date | string
    subscriptions?: TenantSubscriptionListRelationFilter
    tenants?: TenantListRelationFilter
  }, "id" | "providerPlanId">

  export type SubscriptionPlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    billingCycle?: SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    providerPlanId?: SortOrderInput | SortOrder
    _count?: SubscriptionPlanCountOrderByAggregateInput
    _avg?: SubscriptionPlanAvgOrderByAggregateInput
    _max?: SubscriptionPlanMaxOrderByAggregateInput
    _min?: SubscriptionPlanMinOrderByAggregateInput
    _sum?: SubscriptionPlanSumOrderByAggregateInput
  }

  export type SubscriptionPlanScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[]
    OR?: SubscriptionPlanScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubscriptionPlan"> | string
    name?: StringWithAggregatesFilter<"SubscriptionPlan"> | string
    price?: DecimalWithAggregatesFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleWithAggregatesFilter<"SubscriptionPlan"> | $Enums.BillingCycle
    features?: JsonWithAggregatesFilter<"SubscriptionPlan">
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionPlan"> | Date | string
    providerPlanId?: StringNullableWithAggregatesFilter<"SubscriptionPlan"> | string | null
  }

  export type TenantSubscriptionWhereInput = {
    AND?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    OR?: TenantSubscriptionWhereInput[]
    NOT?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    id?: StringFilter<"TenantSubscription"> | string
    tenantId?: StringFilter<"TenantSubscription"> | string
    planId?: StringFilter<"TenantSubscription"> | string
    status?: EnumSubscriptionStatusFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    provider?: StringFilter<"TenantSubscription"> | string
    providerSubscriptionId?: StringNullableFilter<"TenantSubscription"> | string | null
    currentPeriodStart?: DateTimeFilter<"TenantSubscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"TenantSubscription"> | Date | string
    createdAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    SubscriptionPayment?: SubscriptionPaymentListRelationFilter
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TenantSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerSubscriptionId?: SortOrderInput | SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    SubscriptionPayment?: SubscriptionPaymentOrderByRelationAggregateInput
    plan?: SubscriptionPlanOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId?: string
    provider_providerSubscriptionId?: TenantSubscriptionProviderProviderSubscriptionIdCompoundUniqueInput
    AND?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    OR?: TenantSubscriptionWhereInput[]
    NOT?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    planId?: StringFilter<"TenantSubscription"> | string
    status?: EnumSubscriptionStatusFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    provider?: StringFilter<"TenantSubscription"> | string
    providerSubscriptionId?: StringNullableFilter<"TenantSubscription"> | string | null
    currentPeriodStart?: DateTimeFilter<"TenantSubscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"TenantSubscription"> | Date | string
    createdAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    SubscriptionPayment?: SubscriptionPaymentListRelationFilter
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId" | "provider_providerSubscriptionId">

  export type TenantSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerSubscriptionId?: SortOrderInput | SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantSubscriptionCountOrderByAggregateInput
    _max?: TenantSubscriptionMaxOrderByAggregateInput
    _min?: TenantSubscriptionMinOrderByAggregateInput
  }

  export type TenantSubscriptionScalarWhereWithAggregatesInput = {
    AND?: TenantSubscriptionScalarWhereWithAggregatesInput | TenantSubscriptionScalarWhereWithAggregatesInput[]
    OR?: TenantSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: TenantSubscriptionScalarWhereWithAggregatesInput | TenantSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantSubscription"> | string
    tenantId?: StringWithAggregatesFilter<"TenantSubscription"> | string
    planId?: StringWithAggregatesFilter<"TenantSubscription"> | string
    status?: EnumSubscriptionStatusWithAggregatesFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    provider?: StringWithAggregatesFilter<"TenantSubscription"> | string
    providerSubscriptionId?: StringNullableWithAggregatesFilter<"TenantSubscription"> | string | null
    currentPeriodStart?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    currentPeriodEnd?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
  }

  export type SubscriptionPaymentWhereInput = {
    AND?: SubscriptionPaymentWhereInput | SubscriptionPaymentWhereInput[]
    OR?: SubscriptionPaymentWhereInput[]
    NOT?: SubscriptionPaymentWhereInput | SubscriptionPaymentWhereInput[]
    id?: StringFilter<"SubscriptionPayment"> | string
    tenantId?: StringFilter<"SubscriptionPayment"> | string
    amount?: DecimalFilter<"SubscriptionPayment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"SubscriptionPayment"> | string
    status?: StringFilter<"SubscriptionPayment"> | string
    provider?: StringFilter<"SubscriptionPayment"> | string
    providerTransactionId?: StringFilter<"SubscriptionPayment"> | string
    subscriptionId?: StringFilter<"SubscriptionPayment"> | string
    createdAt?: DateTimeFilter<"SubscriptionPayment"> | Date | string
    subscription?: XOR<TenantSubscriptionScalarRelationFilter, TenantSubscriptionWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type SubscriptionPaymentOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    subscription?: TenantSubscriptionOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
  }

  export type SubscriptionPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerTransactionId?: SubscriptionPaymentProviderProviderTransactionIdCompoundUniqueInput
    AND?: SubscriptionPaymentWhereInput | SubscriptionPaymentWhereInput[]
    OR?: SubscriptionPaymentWhereInput[]
    NOT?: SubscriptionPaymentWhereInput | SubscriptionPaymentWhereInput[]
    tenantId?: StringFilter<"SubscriptionPayment"> | string
    amount?: DecimalFilter<"SubscriptionPayment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"SubscriptionPayment"> | string
    status?: StringFilter<"SubscriptionPayment"> | string
    provider?: StringFilter<"SubscriptionPayment"> | string
    providerTransactionId?: StringFilter<"SubscriptionPayment"> | string
    subscriptionId?: StringFilter<"SubscriptionPayment"> | string
    createdAt?: DateTimeFilter<"SubscriptionPayment"> | Date | string
    subscription?: XOR<TenantSubscriptionScalarRelationFilter, TenantSubscriptionWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "provider_providerTransactionId">

  export type SubscriptionPaymentOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionPaymentCountOrderByAggregateInput
    _avg?: SubscriptionPaymentAvgOrderByAggregateInput
    _max?: SubscriptionPaymentMaxOrderByAggregateInput
    _min?: SubscriptionPaymentMinOrderByAggregateInput
    _sum?: SubscriptionPaymentSumOrderByAggregateInput
  }

  export type SubscriptionPaymentScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPaymentScalarWhereWithAggregatesInput | SubscriptionPaymentScalarWhereWithAggregatesInput[]
    OR?: SubscriptionPaymentScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionPaymentScalarWhereWithAggregatesInput | SubscriptionPaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    tenantId?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    amount?: DecimalWithAggregatesFilter<"SubscriptionPayment"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    status?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    provider?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    providerTransactionId?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    subscriptionId?: StringWithAggregatesFilter<"SubscriptionPayment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionPayment"> | Date | string
  }

  export type PaymentIndexWhereInput = {
    AND?: PaymentIndexWhereInput | PaymentIndexWhereInput[]
    OR?: PaymentIndexWhereInput[]
    NOT?: PaymentIndexWhereInput | PaymentIndexWhereInput[]
    id?: StringFilter<"PaymentIndex"> | string
    tenantId?: StringFilter<"PaymentIndex"> | string
    orderId?: StringFilter<"PaymentIndex"> | string
    checkoutRequestId?: StringFilter<"PaymentIndex"> | string
    createdAt?: DateTimeFilter<"PaymentIndex"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type PaymentIndexOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    orderId?: SortOrder
    checkoutRequestId?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type PaymentIndexWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    checkoutRequestId?: string
    AND?: PaymentIndexWhereInput | PaymentIndexWhereInput[]
    OR?: PaymentIndexWhereInput[]
    NOT?: PaymentIndexWhereInput | PaymentIndexWhereInput[]
    tenantId?: StringFilter<"PaymentIndex"> | string
    orderId?: StringFilter<"PaymentIndex"> | string
    createdAt?: DateTimeFilter<"PaymentIndex"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "checkoutRequestId">

  export type PaymentIndexOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    orderId?: SortOrder
    checkoutRequestId?: SortOrder
    createdAt?: SortOrder
    _count?: PaymentIndexCountOrderByAggregateInput
    _max?: PaymentIndexMaxOrderByAggregateInput
    _min?: PaymentIndexMinOrderByAggregateInput
  }

  export type PaymentIndexScalarWhereWithAggregatesInput = {
    AND?: PaymentIndexScalarWhereWithAggregatesInput | PaymentIndexScalarWhereWithAggregatesInput[]
    OR?: PaymentIndexScalarWhereWithAggregatesInput[]
    NOT?: PaymentIndexScalarWhereWithAggregatesInput | PaymentIndexScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentIndex"> | string
    tenantId?: StringWithAggregatesFilter<"PaymentIndex"> | string
    orderId?: StringWithAggregatesFilter<"PaymentIndex"> | string
    checkoutRequestId?: StringWithAggregatesFilter<"PaymentIndex"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PaymentIndex"> | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedOneWithoutTenantInput
    owner: UserCreateNestedOneWithoutOwnedTenantInput
    plan?: SubscriptionPlanCreateNestedOneWithoutTenantsInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexUncheckedCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateOneWithoutTenantNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedTenantNestedInput
    plan?: SubscriptionPlanUpdateOneWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUncheckedUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTenant?: TenantCreateNestedManyWithoutOwnerInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTenant?: TenantUncheckedCreateNestedManyWithoutOwnerInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTenant?: TenantUpdateManyWithoutOwnerNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTenant?: TenantUncheckedUpdateManyWithoutOwnerNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateInput = {
    id?: string
    tokenHash: string
    ipAddress?: string | null
    userAgent?: string | null
    familyId?: string | null
    parentTokenId?: string | null
    revoked?: boolean
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    ipAddress?: string | null
    userAgent?: string | null
    familyId?: string | null
    parentTokenId?: string | null
    revoked?: boolean
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    userId: string
    tokenHash: string
    ipAddress?: string | null
    userAgent?: string | null
    familyId?: string | null
    parentTokenId?: string | null
    revoked?: boolean
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanCreateInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
    subscriptions?: TenantSubscriptionCreateNestedManyWithoutPlanInput
    tenants?: TenantCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUncheckedCreateInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
    subscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptions?: TenantSubscriptionUpdateManyWithoutPlanNestedInput
    tenants?: TenantUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanCreateManyInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
  }

  export type SubscriptionPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TenantSubscriptionCreateInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateInput = {
    id?: string
    tenantId: string
    planId: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type TenantSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type TenantSubscriptionCreateManyInput = {
    id?: string
    tenantId: string
    planId: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    createdAt?: Date | string
    subscription: TenantSubscriptionCreateNestedOneWithoutSubscriptionPaymentInput
    tenant: TenantCreateNestedOneWithoutSubscriptionPaymentInput
  }

  export type SubscriptionPaymentUncheckedCreateInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    subscriptionId: string
    createdAt?: Date | string
  }

  export type SubscriptionPaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: TenantSubscriptionUpdateOneRequiredWithoutSubscriptionPaymentNestedInput
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionPaymentNestedInput
  }

  export type SubscriptionPaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPaymentCreateManyInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    subscriptionId: string
    createdAt?: Date | string
  }

  export type SubscriptionPaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentIndexCreateInput = {
    id?: string
    orderId: string
    checkoutRequestId: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutPaymentIndicesInput
  }

  export type PaymentIndexUncheckedCreateInput = {
    id?: string
    tenantId: string
    orderId: string
    checkoutRequestId: string
    createdAt?: Date | string
  }

  export type PaymentIndexUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutPaymentIndicesNestedInput
  }

  export type PaymentIndexUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentIndexCreateManyInput = {
    id?: string
    tenantId: string
    orderId: string
    checkoutRequestId: string
    createdAt?: Date | string
  }

  export type PaymentIndexUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentIndexUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PaymentIndexListRelationFilter = {
    every?: PaymentIndexWhereInput
    some?: PaymentIndexWhereInput
    none?: PaymentIndexWhereInput
  }

  export type SubscriptionPaymentListRelationFilter = {
    every?: SubscriptionPaymentWhereInput
    some?: SubscriptionPaymentWhereInput
    none?: SubscriptionPaymentWhereInput
  }

  export type TenantSubscriptionNullableScalarRelationFilter = {
    is?: TenantSubscriptionWhereInput | null
    isNot?: TenantSubscriptionWhereInput | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SubscriptionPlanNullableScalarRelationFilter = {
    is?: SubscriptionPlanWhereInput | null
    isNot?: SubscriptionPlanWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaymentIndexOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionPaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrder
    dbSchema?: SortOrder
    status?: SortOrder
    suspendedAt?: SortOrder
    deletedAt?: SortOrder
    ownerId?: SortOrder
    planId?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrder
    dbSchema?: SortOrder
    status?: SortOrder
    suspendedAt?: SortOrder
    deletedAt?: SortOrder
    ownerId?: SortOrder
    planId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrder
    dbSchema?: SortOrder
    status?: SortOrder
    suspendedAt?: SortOrder
    deletedAt?: SortOrder
    ownerId?: SortOrder
    planId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stripeCustomerId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type TenantListRelationFilter = {
    every?: TenantWhereInput
    some?: TenantWhereInput
    none?: TenantWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type TenantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    hashedPassword?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    hashedPassword?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    hashedPassword?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    familyId?: SortOrder
    parentTokenId?: SortOrder
    revoked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    familyId?: SortOrder
    parentTokenId?: SortOrder
    revoked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    familyId?: SortOrder
    parentTokenId?: SortOrder
    revoked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumBillingCycleFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleFilter<$PrismaModel> | $Enums.BillingCycle
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TenantSubscriptionListRelationFilter = {
    every?: TenantSubscriptionWhereInput
    some?: TenantSubscriptionWhereInput
    none?: TenantSubscriptionWhereInput
  }

  export type TenantSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionPlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    billingCycle?: SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    providerPlanId?: SortOrder
  }

  export type SubscriptionPlanAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type SubscriptionPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    billingCycle?: SortOrder
    createdAt?: SortOrder
    providerPlanId?: SortOrder
  }

  export type SubscriptionPlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    billingCycle?: SortOrder
    createdAt?: SortOrder
    providerPlanId?: SortOrder
  }

  export type SubscriptionPlanSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumBillingCycleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleWithAggregatesFilter<$PrismaModel> | $Enums.BillingCycle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingCycleFilter<$PrismaModel>
    _max?: NestedEnumBillingCycleFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type SubscriptionPlanScalarRelationFilter = {
    is?: SubscriptionPlanWhereInput
    isNot?: SubscriptionPlanWhereInput
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type TenantSubscriptionProviderProviderSubscriptionIdCompoundUniqueInput = {
    provider: string
    providerSubscriptionId: string
  }

  export type TenantSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerSubscriptionId?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type TenantSubscriptionScalarRelationFilter = {
    is?: TenantSubscriptionWhereInput
    isNot?: TenantSubscriptionWhereInput
  }

  export type SubscriptionPaymentProviderProviderTransactionIdCompoundUniqueInput = {
    provider: string
    providerTransactionId: string
  }

  export type SubscriptionPaymentCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type SubscriptionPaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPaymentMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerTransactionId?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentIndexCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    orderId?: SortOrder
    checkoutRequestId?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentIndexMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    orderId?: SortOrder
    checkoutRequestId?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentIndexMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    orderId?: SortOrder
    checkoutRequestId?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentIndexCreateNestedManyWithoutTenantInput = {
    create?: XOR<PaymentIndexCreateWithoutTenantInput, PaymentIndexUncheckedCreateWithoutTenantInput> | PaymentIndexCreateWithoutTenantInput[] | PaymentIndexUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentIndexCreateOrConnectWithoutTenantInput | PaymentIndexCreateOrConnectWithoutTenantInput[]
    createMany?: PaymentIndexCreateManyTenantInputEnvelope
    connect?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
  }

  export type SubscriptionPaymentCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutTenantInput, SubscriptionPaymentUncheckedCreateWithoutTenantInput> | SubscriptionPaymentCreateWithoutTenantInput[] | SubscriptionPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutTenantInput | SubscriptionPaymentCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionPaymentCreateManyTenantInputEnvelope
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
  }

  export type TenantSubscriptionCreateNestedOneWithoutTenantInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput
    connect?: TenantSubscriptionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOwnedTenantInput = {
    create?: XOR<UserCreateWithoutOwnedTenantInput, UserUncheckedCreateWithoutOwnedTenantInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTenantInput
    connect?: UserWhereUniqueInput
  }

  export type SubscriptionPlanCreateNestedOneWithoutTenantsInput = {
    create?: XOR<SubscriptionPlanCreateWithoutTenantsInput, SubscriptionPlanUncheckedCreateWithoutTenantsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutTenantsInput
    connect?: SubscriptionPlanWhereUniqueInput
  }

  export type PaymentIndexUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<PaymentIndexCreateWithoutTenantInput, PaymentIndexUncheckedCreateWithoutTenantInput> | PaymentIndexCreateWithoutTenantInput[] | PaymentIndexUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentIndexCreateOrConnectWithoutTenantInput | PaymentIndexCreateOrConnectWithoutTenantInput[]
    createMany?: PaymentIndexCreateManyTenantInputEnvelope
    connect?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
  }

  export type SubscriptionPaymentUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutTenantInput, SubscriptionPaymentUncheckedCreateWithoutTenantInput> | SubscriptionPaymentCreateWithoutTenantInput[] | SubscriptionPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutTenantInput | SubscriptionPaymentCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionPaymentCreateManyTenantInputEnvelope
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
  }

  export type TenantSubscriptionUncheckedCreateNestedOneWithoutTenantInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput
    connect?: TenantSubscriptionWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumTenantStatusFieldUpdateOperationsInput = {
    set?: $Enums.TenantStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaymentIndexUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PaymentIndexCreateWithoutTenantInput, PaymentIndexUncheckedCreateWithoutTenantInput> | PaymentIndexCreateWithoutTenantInput[] | PaymentIndexUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentIndexCreateOrConnectWithoutTenantInput | PaymentIndexCreateOrConnectWithoutTenantInput[]
    upsert?: PaymentIndexUpsertWithWhereUniqueWithoutTenantInput | PaymentIndexUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PaymentIndexCreateManyTenantInputEnvelope
    set?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    disconnect?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    delete?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    connect?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    update?: PaymentIndexUpdateWithWhereUniqueWithoutTenantInput | PaymentIndexUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PaymentIndexUpdateManyWithWhereWithoutTenantInput | PaymentIndexUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PaymentIndexScalarWhereInput | PaymentIndexScalarWhereInput[]
  }

  export type SubscriptionPaymentUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutTenantInput, SubscriptionPaymentUncheckedCreateWithoutTenantInput> | SubscriptionPaymentCreateWithoutTenantInput[] | SubscriptionPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutTenantInput | SubscriptionPaymentCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionPaymentUpsertWithWhereUniqueWithoutTenantInput | SubscriptionPaymentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionPaymentCreateManyTenantInputEnvelope
    set?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    disconnect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    delete?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    update?: SubscriptionPaymentUpdateWithWhereUniqueWithoutTenantInput | SubscriptionPaymentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionPaymentUpdateManyWithWhereWithoutTenantInput | SubscriptionPaymentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionPaymentScalarWhereInput | SubscriptionPaymentScalarWhereInput[]
  }

  export type TenantSubscriptionUpdateOneWithoutTenantNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput
    upsert?: TenantSubscriptionUpsertWithoutTenantInput
    disconnect?: TenantSubscriptionWhereInput | boolean
    delete?: TenantSubscriptionWhereInput | boolean
    connect?: TenantSubscriptionWhereUniqueInput
    update?: XOR<XOR<TenantSubscriptionUpdateToOneWithWhereWithoutTenantInput, TenantSubscriptionUpdateWithoutTenantInput>, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateOneRequiredWithoutOwnedTenantNestedInput = {
    create?: XOR<UserCreateWithoutOwnedTenantInput, UserUncheckedCreateWithoutOwnedTenantInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTenantInput
    upsert?: UserUpsertWithoutOwnedTenantInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedTenantInput, UserUpdateWithoutOwnedTenantInput>, UserUncheckedUpdateWithoutOwnedTenantInput>
  }

  export type SubscriptionPlanUpdateOneWithoutTenantsNestedInput = {
    create?: XOR<SubscriptionPlanCreateWithoutTenantsInput, SubscriptionPlanUncheckedCreateWithoutTenantsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutTenantsInput
    upsert?: SubscriptionPlanUpsertWithoutTenantsInput
    disconnect?: SubscriptionPlanWhereInput | boolean
    delete?: SubscriptionPlanWhereInput | boolean
    connect?: SubscriptionPlanWhereUniqueInput
    update?: XOR<XOR<SubscriptionPlanUpdateToOneWithWhereWithoutTenantsInput, SubscriptionPlanUpdateWithoutTenantsInput>, SubscriptionPlanUncheckedUpdateWithoutTenantsInput>
  }

  export type PaymentIndexUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PaymentIndexCreateWithoutTenantInput, PaymentIndexUncheckedCreateWithoutTenantInput> | PaymentIndexCreateWithoutTenantInput[] | PaymentIndexUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentIndexCreateOrConnectWithoutTenantInput | PaymentIndexCreateOrConnectWithoutTenantInput[]
    upsert?: PaymentIndexUpsertWithWhereUniqueWithoutTenantInput | PaymentIndexUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PaymentIndexCreateManyTenantInputEnvelope
    set?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    disconnect?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    delete?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    connect?: PaymentIndexWhereUniqueInput | PaymentIndexWhereUniqueInput[]
    update?: PaymentIndexUpdateWithWhereUniqueWithoutTenantInput | PaymentIndexUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PaymentIndexUpdateManyWithWhereWithoutTenantInput | PaymentIndexUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PaymentIndexScalarWhereInput | PaymentIndexScalarWhereInput[]
  }

  export type SubscriptionPaymentUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutTenantInput, SubscriptionPaymentUncheckedCreateWithoutTenantInput> | SubscriptionPaymentCreateWithoutTenantInput[] | SubscriptionPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutTenantInput | SubscriptionPaymentCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionPaymentUpsertWithWhereUniqueWithoutTenantInput | SubscriptionPaymentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionPaymentCreateManyTenantInputEnvelope
    set?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    disconnect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    delete?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    update?: SubscriptionPaymentUpdateWithWhereUniqueWithoutTenantInput | SubscriptionPaymentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionPaymentUpdateManyWithWhereWithoutTenantInput | SubscriptionPaymentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionPaymentScalarWhereInput | SubscriptionPaymentScalarWhereInput[]
  }

  export type TenantSubscriptionUncheckedUpdateOneWithoutTenantNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput
    upsert?: TenantSubscriptionUpsertWithoutTenantInput
    disconnect?: TenantSubscriptionWhereInput | boolean
    delete?: TenantSubscriptionWhereInput | boolean
    connect?: TenantSubscriptionWhereUniqueInput
    update?: XOR<XOR<TenantSubscriptionUpdateToOneWithWhereWithoutTenantInput, TenantSubscriptionUpdateWithoutTenantInput>, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type TenantCreateNestedManyWithoutOwnerInput = {
    create?: XOR<TenantCreateWithoutOwnerInput, TenantUncheckedCreateWithoutOwnerInput> | TenantCreateWithoutOwnerInput[] | TenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutOwnerInput | TenantCreateOrConnectWithoutOwnerInput[]
    createMany?: TenantCreateManyOwnerInputEnvelope
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type TenantUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<TenantCreateWithoutOwnerInput, TenantUncheckedCreateWithoutOwnerInput> | TenantCreateWithoutOwnerInput[] | TenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutOwnerInput | TenantCreateOrConnectWithoutOwnerInput[]
    createMany?: TenantCreateManyOwnerInputEnvelope
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type TenantUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<TenantCreateWithoutOwnerInput, TenantUncheckedCreateWithoutOwnerInput> | TenantCreateWithoutOwnerInput[] | TenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutOwnerInput | TenantCreateOrConnectWithoutOwnerInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutOwnerInput | TenantUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: TenantCreateManyOwnerInputEnvelope
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutOwnerInput | TenantUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutOwnerInput | TenantUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type TenantUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<TenantCreateWithoutOwnerInput, TenantUncheckedCreateWithoutOwnerInput> | TenantCreateWithoutOwnerInput[] | TenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutOwnerInput | TenantCreateOrConnectWithoutOwnerInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutOwnerInput | TenantUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: TenantCreateManyOwnerInputEnvelope
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutOwnerInput | TenantUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutOwnerInput | TenantUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type TenantSubscriptionCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type TenantCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type TenantUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumBillingCycleFieldUpdateOperationsInput = {
    set?: $Enums.BillingCycle
  }

  export type TenantSubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutPlanInput | TenantSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type TenantUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutPlanInput | TenantUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutPlanInput | TenantUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutPlanInput | TenantUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutPlanInput | TenantSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type TenantUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutPlanInput | TenantUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutPlanInput | TenantUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutPlanInput | TenantUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type SubscriptionPaymentCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutSubscriptionInput, SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput> | SubscriptionPaymentCreateWithoutSubscriptionInput[] | SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput | SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput[]
    createMany?: SubscriptionPaymentCreateManySubscriptionInputEnvelope
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
  }

  export type SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutSubscriptionsInput
    connect?: SubscriptionPlanWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionInput
    connect?: TenantWhereUniqueInput
  }

  export type SubscriptionPaymentUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutSubscriptionInput, SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput> | SubscriptionPaymentCreateWithoutSubscriptionInput[] | SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput | SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput[]
    createMany?: SubscriptionPaymentCreateManySubscriptionInputEnvelope
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type SubscriptionPaymentUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutSubscriptionInput, SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput> | SubscriptionPaymentCreateWithoutSubscriptionInput[] | SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput | SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput[]
    upsert?: SubscriptionPaymentUpsertWithWhereUniqueWithoutSubscriptionInput | SubscriptionPaymentUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: SubscriptionPaymentCreateManySubscriptionInputEnvelope
    set?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    disconnect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    delete?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    update?: SubscriptionPaymentUpdateWithWhereUniqueWithoutSubscriptionInput | SubscriptionPaymentUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: SubscriptionPaymentUpdateManyWithWhereWithoutSubscriptionInput | SubscriptionPaymentUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: SubscriptionPaymentScalarWhereInput | SubscriptionPaymentScalarWhereInput[]
  }

  export type SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutSubscriptionsInput
    upsert?: SubscriptionPlanUpsertWithoutSubscriptionsInput
    connect?: SubscriptionPlanWhereUniqueInput
    update?: XOR<XOR<SubscriptionPlanUpdateToOneWithWhereWithoutSubscriptionsInput, SubscriptionPlanUpdateWithoutSubscriptionsInput>, SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionInput
    upsert?: TenantUpsertWithoutSubscriptionInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionInput, TenantUpdateWithoutSubscriptionInput>, TenantUncheckedUpdateWithoutSubscriptionInput>
  }

  export type SubscriptionPaymentUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<SubscriptionPaymentCreateWithoutSubscriptionInput, SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput> | SubscriptionPaymentCreateWithoutSubscriptionInput[] | SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput | SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput[]
    upsert?: SubscriptionPaymentUpsertWithWhereUniqueWithoutSubscriptionInput | SubscriptionPaymentUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: SubscriptionPaymentCreateManySubscriptionInputEnvelope
    set?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    disconnect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    delete?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    connect?: SubscriptionPaymentWhereUniqueInput | SubscriptionPaymentWhereUniqueInput[]
    update?: SubscriptionPaymentUpdateWithWhereUniqueWithoutSubscriptionInput | SubscriptionPaymentUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: SubscriptionPaymentUpdateManyWithWhereWithoutSubscriptionInput | SubscriptionPaymentUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: SubscriptionPaymentScalarWhereInput | SubscriptionPaymentScalarWhereInput[]
  }

  export type TenantSubscriptionCreateNestedOneWithoutSubscriptionPaymentInput = {
    create?: XOR<TenantSubscriptionCreateWithoutSubscriptionPaymentInput, TenantSubscriptionUncheckedCreateWithoutSubscriptionPaymentInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutSubscriptionPaymentInput
    connect?: TenantSubscriptionWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutSubscriptionPaymentInput = {
    create?: XOR<TenantCreateWithoutSubscriptionPaymentInput, TenantUncheckedCreateWithoutSubscriptionPaymentInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionPaymentInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantSubscriptionUpdateOneRequiredWithoutSubscriptionPaymentNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutSubscriptionPaymentInput, TenantSubscriptionUncheckedCreateWithoutSubscriptionPaymentInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutSubscriptionPaymentInput
    upsert?: TenantSubscriptionUpsertWithoutSubscriptionPaymentInput
    connect?: TenantSubscriptionWhereUniqueInput
    update?: XOR<XOR<TenantSubscriptionUpdateToOneWithWhereWithoutSubscriptionPaymentInput, TenantSubscriptionUpdateWithoutSubscriptionPaymentInput>, TenantSubscriptionUncheckedUpdateWithoutSubscriptionPaymentInput>
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionPaymentNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionPaymentInput, TenantUncheckedCreateWithoutSubscriptionPaymentInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionPaymentInput
    upsert?: TenantUpsertWithoutSubscriptionPaymentInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionPaymentInput, TenantUpdateWithoutSubscriptionPaymentInput>, TenantUncheckedUpdateWithoutSubscriptionPaymentInput>
  }

  export type TenantCreateNestedOneWithoutPaymentIndicesInput = {
    create?: XOR<TenantCreateWithoutPaymentIndicesInput, TenantUncheckedCreateWithoutPaymentIndicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPaymentIndicesInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutPaymentIndicesNestedInput = {
    create?: XOR<TenantCreateWithoutPaymentIndicesInput, TenantUncheckedCreateWithoutPaymentIndicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPaymentIndicesInput
    upsert?: TenantUpsertWithoutPaymentIndicesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPaymentIndicesInput, TenantUpdateWithoutPaymentIndicesInput>, TenantUncheckedUpdateWithoutPaymentIndicesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumBillingCycleFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleFilter<$PrismaModel> | $Enums.BillingCycle
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumBillingCycleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleWithAggregatesFilter<$PrismaModel> | $Enums.BillingCycle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingCycleFilter<$PrismaModel>
    _max?: NestedEnumBillingCycleFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type PaymentIndexCreateWithoutTenantInput = {
    id?: string
    orderId: string
    checkoutRequestId: string
    createdAt?: Date | string
  }

  export type PaymentIndexUncheckedCreateWithoutTenantInput = {
    id?: string
    orderId: string
    checkoutRequestId: string
    createdAt?: Date | string
  }

  export type PaymentIndexCreateOrConnectWithoutTenantInput = {
    where: PaymentIndexWhereUniqueInput
    create: XOR<PaymentIndexCreateWithoutTenantInput, PaymentIndexUncheckedCreateWithoutTenantInput>
  }

  export type PaymentIndexCreateManyTenantInputEnvelope = {
    data: PaymentIndexCreateManyTenantInput | PaymentIndexCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionPaymentCreateWithoutTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    createdAt?: Date | string
    subscription: TenantSubscriptionCreateNestedOneWithoutSubscriptionPaymentInput
  }

  export type SubscriptionPaymentUncheckedCreateWithoutTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    subscriptionId: string
    createdAt?: Date | string
  }

  export type SubscriptionPaymentCreateOrConnectWithoutTenantInput = {
    where: SubscriptionPaymentWhereUniqueInput
    create: XOR<SubscriptionPaymentCreateWithoutTenantInput, SubscriptionPaymentUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionPaymentCreateManyTenantInputEnvelope = {
    data: SubscriptionPaymentCreateManyTenantInput | SubscriptionPaymentCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantSubscriptionCreateWithoutTenantInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutTenantInput = {
    id?: string
    planId: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type TenantSubscriptionCreateOrConnectWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateWithoutOwnedTenantInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedTenantInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedTenantInput, UserUncheckedCreateWithoutOwnedTenantInput>
  }

  export type SubscriptionPlanCreateWithoutTenantsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
    subscriptions?: TenantSubscriptionCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUncheckedCreateWithoutTenantsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
    subscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanCreateOrConnectWithoutTenantsInput = {
    where: SubscriptionPlanWhereUniqueInput
    create: XOR<SubscriptionPlanCreateWithoutTenantsInput, SubscriptionPlanUncheckedCreateWithoutTenantsInput>
  }

  export type PaymentIndexUpsertWithWhereUniqueWithoutTenantInput = {
    where: PaymentIndexWhereUniqueInput
    update: XOR<PaymentIndexUpdateWithoutTenantInput, PaymentIndexUncheckedUpdateWithoutTenantInput>
    create: XOR<PaymentIndexCreateWithoutTenantInput, PaymentIndexUncheckedCreateWithoutTenantInput>
  }

  export type PaymentIndexUpdateWithWhereUniqueWithoutTenantInput = {
    where: PaymentIndexWhereUniqueInput
    data: XOR<PaymentIndexUpdateWithoutTenantInput, PaymentIndexUncheckedUpdateWithoutTenantInput>
  }

  export type PaymentIndexUpdateManyWithWhereWithoutTenantInput = {
    where: PaymentIndexScalarWhereInput
    data: XOR<PaymentIndexUpdateManyMutationInput, PaymentIndexUncheckedUpdateManyWithoutTenantInput>
  }

  export type PaymentIndexScalarWhereInput = {
    AND?: PaymentIndexScalarWhereInput | PaymentIndexScalarWhereInput[]
    OR?: PaymentIndexScalarWhereInput[]
    NOT?: PaymentIndexScalarWhereInput | PaymentIndexScalarWhereInput[]
    id?: StringFilter<"PaymentIndex"> | string
    tenantId?: StringFilter<"PaymentIndex"> | string
    orderId?: StringFilter<"PaymentIndex"> | string
    checkoutRequestId?: StringFilter<"PaymentIndex"> | string
    createdAt?: DateTimeFilter<"PaymentIndex"> | Date | string
  }

  export type SubscriptionPaymentUpsertWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionPaymentWhereUniqueInput
    update: XOR<SubscriptionPaymentUpdateWithoutTenantInput, SubscriptionPaymentUncheckedUpdateWithoutTenantInput>
    create: XOR<SubscriptionPaymentCreateWithoutTenantInput, SubscriptionPaymentUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionPaymentUpdateWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionPaymentWhereUniqueInput
    data: XOR<SubscriptionPaymentUpdateWithoutTenantInput, SubscriptionPaymentUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionPaymentUpdateManyWithWhereWithoutTenantInput = {
    where: SubscriptionPaymentScalarWhereInput
    data: XOR<SubscriptionPaymentUpdateManyMutationInput, SubscriptionPaymentUncheckedUpdateManyWithoutTenantInput>
  }

  export type SubscriptionPaymentScalarWhereInput = {
    AND?: SubscriptionPaymentScalarWhereInput | SubscriptionPaymentScalarWhereInput[]
    OR?: SubscriptionPaymentScalarWhereInput[]
    NOT?: SubscriptionPaymentScalarWhereInput | SubscriptionPaymentScalarWhereInput[]
    id?: StringFilter<"SubscriptionPayment"> | string
    tenantId?: StringFilter<"SubscriptionPayment"> | string
    amount?: DecimalFilter<"SubscriptionPayment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"SubscriptionPayment"> | string
    status?: StringFilter<"SubscriptionPayment"> | string
    provider?: StringFilter<"SubscriptionPayment"> | string
    providerTransactionId?: StringFilter<"SubscriptionPayment"> | string
    subscriptionId?: StringFilter<"SubscriptionPayment"> | string
    createdAt?: DateTimeFilter<"SubscriptionPayment"> | Date | string
  }

  export type TenantSubscriptionUpsertWithoutTenantInput = {
    update: XOR<TenantSubscriptionUpdateWithoutTenantInput, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
    where?: TenantSubscriptionWhereInput
  }

  export type TenantSubscriptionUpdateToOneWithWhereWithoutTenantInput = {
    where?: TenantSubscriptionWhereInput
    data: XOR<TenantSubscriptionUpdateWithoutTenantInput, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type TenantSubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type UserUpsertWithoutOwnedTenantInput = {
    update: XOR<UserUpdateWithoutOwnedTenantInput, UserUncheckedUpdateWithoutOwnedTenantInput>
    create: XOR<UserCreateWithoutOwnedTenantInput, UserUncheckedCreateWithoutOwnedTenantInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedTenantInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedTenantInput, UserUncheckedUpdateWithoutOwnedTenantInput>
  }

  export type UserUpdateWithoutOwnedTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SubscriptionPlanUpsertWithoutTenantsInput = {
    update: XOR<SubscriptionPlanUpdateWithoutTenantsInput, SubscriptionPlanUncheckedUpdateWithoutTenantsInput>
    create: XOR<SubscriptionPlanCreateWithoutTenantsInput, SubscriptionPlanUncheckedCreateWithoutTenantsInput>
    where?: SubscriptionPlanWhereInput
  }

  export type SubscriptionPlanUpdateToOneWithWhereWithoutTenantsInput = {
    where?: SubscriptionPlanWhereInput
    data: XOR<SubscriptionPlanUpdateWithoutTenantsInput, SubscriptionPlanUncheckedUpdateWithoutTenantsInput>
  }

  export type SubscriptionPlanUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptions?: TenantSubscriptionUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type TenantCreateWithoutOwnerInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedOneWithoutTenantInput
    plan?: SubscriptionPlanCreateNestedOneWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexUncheckedCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutOwnerInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutOwnerInput, TenantUncheckedCreateWithoutOwnerInput>
  }

  export type TenantCreateManyOwnerInputEnvelope = {
    data: TenantCreateManyOwnerInput | TenantCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    ipAddress?: string | null
    userAgent?: string | null
    familyId?: string | null
    parentTokenId?: string | null
    revoked?: boolean
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    ipAddress?: string | null
    userAgent?: string | null
    familyId?: string | null
    parentTokenId?: string | null
    revoked?: boolean
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithWhereUniqueWithoutOwnerInput = {
    where: TenantWhereUniqueInput
    update: XOR<TenantUpdateWithoutOwnerInput, TenantUncheckedUpdateWithoutOwnerInput>
    create: XOR<TenantCreateWithoutOwnerInput, TenantUncheckedCreateWithoutOwnerInput>
  }

  export type TenantUpdateWithWhereUniqueWithoutOwnerInput = {
    where: TenantWhereUniqueInput
    data: XOR<TenantUpdateWithoutOwnerInput, TenantUncheckedUpdateWithoutOwnerInput>
  }

  export type TenantUpdateManyWithWhereWithoutOwnerInput = {
    where: TenantScalarWhereInput
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyWithoutOwnerInput>
  }

  export type TenantScalarWhereInput = {
    AND?: TenantScalarWhereInput | TenantScalarWhereInput[]
    OR?: TenantScalarWhereInput[]
    NOT?: TenantScalarWhereInput | TenantScalarWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    customDomain?: StringNullableFilter<"Tenant"> | string | null
    dbSchema?: StringFilter<"Tenant"> | string
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    suspendedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    ownerId?: StringFilter<"Tenant"> | string
    planId?: StringNullableFilter<"Tenant"> | string | null
    settings?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    stripeCustomerId?: StringNullableFilter<"Tenant"> | string | null
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    ipAddress?: StringNullableFilter<"RefreshToken"> | string | null
    userAgent?: StringNullableFilter<"RefreshToken"> | string | null
    familyId?: StringNullableFilter<"RefreshToken"> | string | null
    parentTokenId?: StringNullableFilter<"RefreshToken"> | string | null
    revoked?: BoolFilter<"RefreshToken"> | boolean
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTenant?: TenantCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    hashedPassword: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTenant?: TenantUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTenant?: TenantUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    hashedPassword?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTenant?: TenantUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type TenantSubscriptionCreateWithoutPlanInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutSubscriptionInput
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string
    tenantId: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type TenantSubscriptionCreateOrConnectWithoutPlanInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type TenantSubscriptionCreateManyPlanInputEnvelope = {
    data: TenantSubscriptionCreateManyPlanInput | TenantSubscriptionCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type TenantCreateWithoutPlanInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedOneWithoutTenantInput
    owner: UserCreateNestedOneWithoutOwnedTenantInput
  }

  export type TenantUncheckedCreateWithoutPlanInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexUncheckedCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPlanInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput>
  }

  export type TenantCreateManyPlanInputEnvelope = {
    data: TenantCreateManyPlanInput | TenantCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: TenantSubscriptionWhereUniqueInput
    update: XOR<TenantSubscriptionUpdateWithoutPlanInput, TenantSubscriptionUncheckedUpdateWithoutPlanInput>
    create: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: TenantSubscriptionWhereUniqueInput
    data: XOR<TenantSubscriptionUpdateWithoutPlanInput, TenantSubscriptionUncheckedUpdateWithoutPlanInput>
  }

  export type TenantSubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: TenantSubscriptionScalarWhereInput
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyWithoutPlanInput>
  }

  export type TenantSubscriptionScalarWhereInput = {
    AND?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
    OR?: TenantSubscriptionScalarWhereInput[]
    NOT?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
    id?: StringFilter<"TenantSubscription"> | string
    tenantId?: StringFilter<"TenantSubscription"> | string
    planId?: StringFilter<"TenantSubscription"> | string
    status?: EnumSubscriptionStatusFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    provider?: StringFilter<"TenantSubscription"> | string
    providerSubscriptionId?: StringNullableFilter<"TenantSubscription"> | string | null
    currentPeriodStart?: DateTimeFilter<"TenantSubscription"> | Date | string
    currentPeriodEnd?: DateTimeFilter<"TenantSubscription"> | Date | string
    createdAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"TenantSubscription"> | Date | string
  }

  export type TenantUpsertWithWhereUniqueWithoutPlanInput = {
    where: TenantWhereUniqueInput
    update: XOR<TenantUpdateWithoutPlanInput, TenantUncheckedUpdateWithoutPlanInput>
    create: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput>
  }

  export type TenantUpdateWithWhereUniqueWithoutPlanInput = {
    where: TenantWhereUniqueInput
    data: XOR<TenantUpdateWithoutPlanInput, TenantUncheckedUpdateWithoutPlanInput>
  }

  export type TenantUpdateManyWithWhereWithoutPlanInput = {
    where: TenantScalarWhereInput
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyWithoutPlanInput>
  }

  export type SubscriptionPaymentCreateWithoutSubscriptionInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionPaymentInput
  }

  export type SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    createdAt?: Date | string
  }

  export type SubscriptionPaymentCreateOrConnectWithoutSubscriptionInput = {
    where: SubscriptionPaymentWhereUniqueInput
    create: XOR<SubscriptionPaymentCreateWithoutSubscriptionInput, SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput>
  }

  export type SubscriptionPaymentCreateManySubscriptionInputEnvelope = {
    data: SubscriptionPaymentCreateManySubscriptionInput | SubscriptionPaymentCreateManySubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionPlanCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
    tenants?: TenantCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    billingCycle: $Enums.BillingCycle
    features: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    providerPlanId?: string | null
    tenants?: TenantUncheckedCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanCreateOrConnectWithoutSubscriptionsInput = {
    where: SubscriptionPlanWhereUniqueInput
    create: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
  }

  export type TenantCreateWithoutSubscriptionInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutTenantInput
    owner: UserCreateNestedOneWithoutOwnedTenantInput
    plan?: SubscriptionPlanCreateNestedOneWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexUncheckedCreateNestedManyWithoutTenantInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
  }

  export type SubscriptionPaymentUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: SubscriptionPaymentWhereUniqueInput
    update: XOR<SubscriptionPaymentUpdateWithoutSubscriptionInput, SubscriptionPaymentUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<SubscriptionPaymentCreateWithoutSubscriptionInput, SubscriptionPaymentUncheckedCreateWithoutSubscriptionInput>
  }

  export type SubscriptionPaymentUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: SubscriptionPaymentWhereUniqueInput
    data: XOR<SubscriptionPaymentUpdateWithoutSubscriptionInput, SubscriptionPaymentUncheckedUpdateWithoutSubscriptionInput>
  }

  export type SubscriptionPaymentUpdateManyWithWhereWithoutSubscriptionInput = {
    where: SubscriptionPaymentScalarWhereInput
    data: XOR<SubscriptionPaymentUpdateManyMutationInput, SubscriptionPaymentUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type SubscriptionPlanUpsertWithoutSubscriptionsInput = {
    update: XOR<SubscriptionPlanUpdateWithoutSubscriptionsInput, SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
    where?: SubscriptionPlanWhereInput
  }

  export type SubscriptionPlanUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: SubscriptionPlanWhereInput
    data: XOR<SubscriptionPlanUpdateWithoutSubscriptionsInput, SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type SubscriptionPlanUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    tenants?: TenantUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    features?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    providerPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    tenants?: TenantUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type TenantUpsertWithoutSubscriptionInput = {
    update: XOR<TenantUpdateWithoutSubscriptionInput, TenantUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionInput, TenantUncheckedUpdateWithoutSubscriptionInput>
  }

  export type TenantUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutTenantNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedTenantNestedInput
    plan?: SubscriptionPlanUpdateOneWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUncheckedUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantSubscriptionCreateWithoutSubscriptionPaymentInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutSubscriptionPaymentInput = {
    id?: string
    tenantId: string
    planId: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantSubscriptionCreateOrConnectWithoutSubscriptionPaymentInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutSubscriptionPaymentInput, TenantSubscriptionUncheckedCreateWithoutSubscriptionPaymentInput>
  }

  export type TenantCreateWithoutSubscriptionPaymentInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedOneWithoutTenantInput
    owner: UserCreateNestedOneWithoutOwnedTenantInput
    plan?: SubscriptionPlanCreateNestedOneWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionPaymentInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    paymentIndices?: PaymentIndexUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionPaymentInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionPaymentInput, TenantUncheckedCreateWithoutSubscriptionPaymentInput>
  }

  export type TenantSubscriptionUpsertWithoutSubscriptionPaymentInput = {
    update: XOR<TenantSubscriptionUpdateWithoutSubscriptionPaymentInput, TenantSubscriptionUncheckedUpdateWithoutSubscriptionPaymentInput>
    create: XOR<TenantSubscriptionCreateWithoutSubscriptionPaymentInput, TenantSubscriptionUncheckedCreateWithoutSubscriptionPaymentInput>
    where?: TenantSubscriptionWhereInput
  }

  export type TenantSubscriptionUpdateToOneWithWhereWithoutSubscriptionPaymentInput = {
    where?: TenantSubscriptionWhereInput
    data: XOR<TenantSubscriptionUpdateWithoutSubscriptionPaymentInput, TenantSubscriptionUncheckedUpdateWithoutSubscriptionPaymentInput>
  }

  export type TenantSubscriptionUpdateWithoutSubscriptionPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutSubscriptionPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUpsertWithoutSubscriptionPaymentInput = {
    update: XOR<TenantUpdateWithoutSubscriptionPaymentInput, TenantUncheckedUpdateWithoutSubscriptionPaymentInput>
    create: XOR<TenantCreateWithoutSubscriptionPaymentInput, TenantUncheckedCreateWithoutSubscriptionPaymentInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionPaymentInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionPaymentInput, TenantUncheckedUpdateWithoutSubscriptionPaymentInput>
  }

  export type TenantUpdateWithoutSubscriptionPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateOneWithoutTenantNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedTenantNestedInput
    plan?: SubscriptionPlanUpdateOneWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantCreateWithoutPaymentIndicesInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    SubscriptionPayment?: SubscriptionPaymentCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedOneWithoutTenantInput
    owner: UserCreateNestedOneWithoutOwnedTenantInput
    plan?: SubscriptionPlanCreateNestedOneWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutPaymentIndicesInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
    SubscriptionPayment?: SubscriptionPaymentUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPaymentIndicesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPaymentIndicesInput, TenantUncheckedCreateWithoutPaymentIndicesInput>
  }

  export type TenantUpsertWithoutPaymentIndicesInput = {
    update: XOR<TenantUpdateWithoutPaymentIndicesInput, TenantUncheckedUpdateWithoutPaymentIndicesInput>
    create: XOR<TenantCreateWithoutPaymentIndicesInput, TenantUncheckedCreateWithoutPaymentIndicesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPaymentIndicesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPaymentIndicesInput, TenantUncheckedUpdateWithoutPaymentIndicesInput>
  }

  export type TenantUpdateWithoutPaymentIndicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateOneWithoutTenantNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedTenantNestedInput
    plan?: SubscriptionPlanUpdateOneWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutPaymentIndicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type PaymentIndexCreateManyTenantInput = {
    id?: string
    orderId: string
    checkoutRequestId: string
    createdAt?: Date | string
  }

  export type SubscriptionPaymentCreateManyTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    subscriptionId: string
    createdAt?: Date | string
  }

  export type PaymentIndexUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentIndexUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentIndexUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    checkoutRequestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPaymentUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: TenantSubscriptionUpdateOneRequiredWithoutSubscriptionPaymentNestedInput
  }

  export type SubscriptionPaymentUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPaymentUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateManyOwnerInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    planId?: string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    tokenHash: string
    ipAddress?: string | null
    userAgent?: string | null
    familyId?: string | null
    parentTokenId?: string | null
    revoked?: boolean
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type TenantUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateOneWithoutTenantNestedInput
    plan?: SubscriptionPlanUpdateOneWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUncheckedUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    familyId?: NullableStringFieldUpdateOperationsInput | string | null
    parentTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    revoked?: BoolFieldUpdateOperationsInput | boolean
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSubscriptionCreateManyPlanInput = {
    id?: string
    tenantId: string
    status?: $Enums.SubscriptionStatus
    provider?: string
    providerSubscriptionId?: string | null
    currentPeriodStart: Date | string
    currentPeriodEnd: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantCreateManyPlanInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    dbSchema: string
    status?: $Enums.TenantStatus
    suspendedAt?: Date | string | null
    deletedAt?: Date | string | null
    ownerId: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    stripeCustomerId?: string | null
  }

  export type TenantSubscriptionUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutSubscriptionNestedInput
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    provider?: StringFieldUpdateOperationsInput | string
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateOneWithoutTenantNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentIndices?: PaymentIndexUncheckedUpdateManyWithoutTenantNestedInput
    SubscriptionPayment?: SubscriptionPaymentUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    dbSchema?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionPaymentCreateManySubscriptionInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status: string
    provider: string
    providerTransactionId: string
    createdAt?: Date | string
  }

  export type SubscriptionPaymentUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionPaymentNestedInput
  }

  export type SubscriptionPaymentUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPaymentUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerTransactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}