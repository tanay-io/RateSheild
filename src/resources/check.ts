// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

/**
 * Rate-limit check endpoint — requires API key
 */
export class Check extends APIResource {
  /**
   * The core rate-limiting endpoint. Pass an identifier (`key`), a time window in
   * seconds (`window`), a maximum request count (`limit`), and the algorithm to use
   * (`algo`).
   *
   * RateShield evaluates the request atomically (via Redis Lua scripts) and either
   * allows it (`200 OK`) or rejects it (`429 Too Many Requests`).
   *
   * ### Algorithms
   *
   * | Value          | Description                                                                                |
   * | -------------- | ------------------------------------------------------------------------------------------ |
   * | `fixed`        | Fixed Window — counts requests within a fixed time bucket.                                 |
   * | `sliding`      | Sliding Window — uses a Redis sorted set with millisecond timestamps for a rolling window. |
   * | `token_bucket` | Token Bucket — continuous refill model; allows controlled bursting.                        |
   *
   * Requires a valid API key in the `X-API-Key` header.
   *
   * @example
   * ```ts
   * const response = await client.check.enforceRateLimit({
   *   key: 'user:42',
   *   limit: 100,
   *   window: 60,
   *   algo: 'fixed',
   * });
   * ```
   */
  enforceRateLimit(body: CheckEnforceRateLimitParams, options?: RequestOptions): APIPromise<string> {
    return this._client.post('/check', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: 'text/plain' }, options?.headers]),
      __security: { apiKeyAuth: true },
    });
  }
}

export type CheckEnforceRateLimitResponse = string;

export interface CheckEnforceRateLimitParams {
  /**
   * Arbitrary identifier for the entity being rate-limited. Typical values include a
   * user ID, IP address, or endpoint name.
   */
  key: string;

  /**
   * Maximum number of requests allowed within `window` seconds.
   */
  limit: number;

  /**
   * Time window in seconds over which the limit is enforced.
   */
  window: number;

  algo?: 'fixed' | 'sliding' | 'token_bucket';
}

export declare namespace Check {
  export {
    type CheckEnforceRateLimitResponse as CheckEnforceRateLimitResponse,
    type CheckEnforceRateLimitParams as CheckEnforceRateLimitParams,
  };
}
