// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Rate-limit rule management — requires JWT bearer token
 */
export class Rules extends APIResource {
  /**
   * Creates a new rate-limit rule for the authenticated user. All of `routePattern`,
   * `algo`, `limit`, and `window` are required. `keyBy` defaults to `ip` if omitted.
   *
   * @example
   * ```ts
   * const ruleObject = await client.dashboard.rules.create({
   *   algo: 'sliding',
   *   limit: 100,
   *   routePattern: '/api/payments',
   *   window: 60,
   *   keyBy: 'ip',
   * });
   * ```
   */
  create(body: RuleCreateParams, options?: RequestOptions): APIPromise<RuleObject> {
    return this._client.post('/dashboard/rules', { body, ...options, __security: {} });
  }

  /**
   * Updates one or more fields of an existing rule owned by the authenticated user.
   * Returns `404` if the rule is not found or belongs to another user.
   *
   * @example
   * ```ts
   * const ruleObject = await client.dashboard.rules.update(1, {
   *   algo: 'token_bucket',
   *   limit: 200,
   * });
   * ```
   */
  update(ruleID: number, body: RuleUpdateParams, options?: RequestOptions): APIPromise<RuleObject> {
    return this._client.put(path`/dashboard/rules/${ruleID}`, { body, ...options, __security: {} });
  }

  /**
   * Returns all saved rate-limit rules owned by the authenticated user.
   *
   * @example
   * ```ts
   * const ruleObjects = await client.dashboard.rules.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<RuleListResponse> {
    return this._client.get('/dashboard/rules', { ...options, __security: {} });
  }

  /**
   * Permanently deletes the specified rule. Returns `404` if the rule is not found
   * or belongs to another user.
   *
   * @example
   * ```ts
   * const rule = await client.dashboard.rules.delete(1);
   * ```
   */
  delete(ruleID: number, options?: RequestOptions): APIPromise<RuleDeleteResponse> {
    return this._client.delete(path`/dashboard/rules/${ruleID}`, { ...options, __security: {} });
  }
}

/**
 * A saved rate-limit rule attached to a route pattern.
 */
export interface RuleObject {
  id?: number;

  algo?: 'fixed' | 'sliding' | 'token_bucket';

  createdAt?: string;

  /**
   * Field to key the rate limit by (e.g. `ip`, `user`).
   */
  keyBy?: string;

  /**
   * Maximum number of requests allowed within the window.
   */
  limit?: number;

  /**
   * The route or identifier pattern this rule applies to.
   */
  routePattern?: string;

  updatedAt?: string;

  userId?: number;

  /**
   * Time window in seconds.
   */
  window?: number;
}

export type RuleListResponse = Array<RuleObject>;

export interface RuleDeleteResponse {
  message?: string;
}

export interface RuleCreateParams {
  algo: 'fixed' | 'sliding' | 'token_bucket';

  limit: number;

  routePattern: string;

  window: number;

  keyBy?: string;
}

export interface RuleUpdateParams {
  algo?: 'fixed' | 'sliding' | 'token_bucket';

  keyBy?: string;

  limit?: number;

  routePattern?: string;

  window?: number;
}

export declare namespace Rules {
  export {
    type RuleObject as RuleObject,
    type RuleListResponse as RuleListResponse,
    type RuleDeleteResponse as RuleDeleteResponse,
    type RuleCreateParams as RuleCreateParams,
    type RuleUpdateParams as RuleUpdateParams,
  };
}
