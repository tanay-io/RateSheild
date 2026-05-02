// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * API key management and stats — requires JWT bearer token
 */
export class Apikeys extends APIResource {
  /**
   * Generates a cryptographically secure 32-byte (64-character hex) API key, stores
   * its SHA-256 hash in the database, and returns the **raw key once**. The raw key
   * is **never stored** — save it immediately upon creation.
   *
   * @example
   * ```ts
   * const createAPIKeyResponse =
   *   await client.dashboard.apikeys.create({
   *     name: 'my-production-key',
   *   });
   * ```
   */
  create(body: ApikeyCreateParams, options?: RequestOptions): APIPromise<CreateAPIKeyResponse> {
    return this._client.post('/dashboard/apikeys', { body, ...options, __security: { bearerAuth: true } });
  }

  /**
   * Returns metadata for all API keys belonging to the currently authenticated user.
   * The raw key value is **never included**.
   *
   * @example
   * ```ts
   * const apiKeyListResponse =
   *   await client.dashboard.apikeys.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<APIKeyListResponse> {
    return this._client.get('/dashboard/apikeys', { ...options, __security: { bearerAuth: true } });
  }

  /**
   * Marks the specified API key as revoked. A revoked key is rejected by the
   * `X-API-Key` middleware. The key record is **not deleted** — only the `revoked`
   * flag is set to `true`.
   *
   * The key must belong to the authenticated user.
   *
   * @example
   * ```ts
   * const revokeAPIKeyResponse =
   *   await client.dashboard.apikeys.revoke(7);
   * ```
   */
  revoke(keyID: number, options?: RequestOptions): APIPromise<RevokeAPIKeyResponse> {
    return this._client.delete(path`/dashboard/apikeys/${keyID}`, {
      ...options,
      __security: { bearerAuth: true },
    });
  }
}

export interface APIKeyListResponse {
  keys?: Array<APIKeyObject>;
}

/**
 * Metadata about a single API key. The raw key is never returned here.
 */
export interface APIKeyObject {
  id?: number;

  createdAt?: string;

  name?: string;

  /**
   * First 6 characters of the raw key, for identification.
   */
  prefix?: string;

  revoked?: boolean;
}

/**
 * Contains the **raw** API key. This is the **only** time the full key is returned
 * — store it securely.
 */
export interface CreateAPIKeyResponse {
  /**
   * 64-character hex API key (32 random bytes).
   */
  key?: string;
}

export interface RevokeAPIKeyResponse {
  message?: string;
}

export interface ApikeyCreateParams {
  /**
   * A human-readable label for the API key.
   */
  name: string;
}

export declare namespace Apikeys {
  export {
    type APIKeyListResponse as APIKeyListResponse,
    type APIKeyObject as APIKeyObject,
    type CreateAPIKeyResponse as CreateAPIKeyResponse,
    type RevokeAPIKeyResponse as RevokeAPIKeyResponse,
    type ApikeyCreateParams as ApikeyCreateParams,
  };
}
