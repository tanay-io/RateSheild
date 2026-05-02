// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

/**
 * Service health check
 */
export class Health extends APIResource {
  /**
   * Returns `healthy` with HTTP 200 if the server is running.
   *
   * @example
   * ```ts
   * const response = await client.health.check();
   * ```
   */
  check(options?: RequestOptions): APIPromise<string> {
    return this._client.get('/health', {
      ...options,
      headers: buildHeaders([{ Accept: 'text/plain' }, options?.headers]),
      __security: {},
    });
  }
}

export type HealthCheckResponse = string;

export declare namespace Health {
  export { type HealthCheckResponse as HealthCheckResponse };
}
