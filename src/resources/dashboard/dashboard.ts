// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ApikeysAPI from './apikeys';
import {
  ApikeyCreateParams,
  ApikeyCreateResponse,
  ApikeyListResponse,
  ApikeyRevokeResponse,
  Apikeys,
} from './apikeys';
import * as RulesAPI from './rules';
import {
  RuleCreateParams,
  RuleDeleteResponse,
  RuleListResponse,
  RuleObject,
  RuleUpdateParams,
  Rules,
} from './rules';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

/**
 * API key management and stats — requires JWT bearer token
 */
export class Dashboard extends APIResource {
  apikeys: ApikeysAPI.Apikeys = new ApikeysAPI.Apikeys(this._client);
  rules: RulesAPI.Rules = new RulesAPI.Rules(this._client);

  /**
   * Returns the most recent rate-limit check log entries for the authenticated user,
   * ordered newest-first. Use the `limit` query parameter to control how many
   * entries are returned (default: 50).
   *
   * @example
   * ```ts
   * const response = await client.dashboard.getLogs();
   * ```
   */
  getLogs(
    query: DashboardGetLogsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DashboardGetLogsResponse> {
    return this._client.get('/dashboard/logs', { query, ...options, __security: {} });
  }

  /**
   * Returns aggregated statistics — total requests, allowed count, blocked count,
   * and active API key count — for the currently authenticated user.
   *
   * @example
   * ```ts
   * const response = await client.dashboard.getStats();
   * ```
   */
  getStats(options?: RequestOptions): APIPromise<DashboardGetStatsResponse> {
    return this._client.get('/dashboard/stats', { ...options, __security: {} });
  }

  /**
   * Upgrades the HTTP connection to a WebSocket. Once connected, the server pushes
   * `CheckLogEntry` JSON messages in real-time as rate-limit checks are processed
   * for the authenticated user.
   *
   * The connection is kept alive with a server-side ping every 30 seconds. If no
   * pong is received within 60 seconds the connection is closed.
   *
   * **Connection**: Send `Upgrade: websocket` and `Connection: Upgrade` headers as
   * per RFC 6455. The JWT must be valid at upgrade time.
   *
   * @example
   * ```ts
   * await client.dashboard.subscribeLive();
   * ```
   */
  subscribeLive(options?: RequestOptions): APIPromise<void> {
    return this._client.get('/dashboard/live', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      __security: {},
    });
  }
}

export type DashboardGetLogsResponse = Array<DashboardGetLogsResponse.DashboardGetLogsResponseItem>;

export namespace DashboardGetLogsResponse {
  /**
   * A single recorded rate-limit check event.
   */
  export interface DashboardGetLogsResponseItem {
    /**
     * Algorithm used for the check.
     */
    algo?: 'fixed' | 'sliding' | 'token_bucket';

    /**
     * Whether the request was allowed or blocked.
     */
    allowed?: boolean;

    /**
     * IP address of the caller.
     */
    ip?: string;

    /**
     * The identifier that was rate-limited.
     */
    key?: string;

    /**
     * When the check occurred.
     */
    timestamp?: string;

    /**
     * Owner user ID.
     */
    userId?: number;
  }
}

export interface DashboardGetStatsResponse {
  /**
   * Number of non-revoked API keys for this user.
   */
  active_keys?: number;

  /**
   * Number of requests that were allowed.
   */
  allowed_count?: number;

  /**
   * Number of requests that were rate-limited (blocked).
   */
  blocked_count?: number;

  /**
   * Total number of rate-limit check requests processed.
   */
  total_requests?: number;
}

export interface DashboardGetLogsParams {
  /**
   * Maximum number of log entries to return. Defaults to 50.
   */
  limit?: number;
}

Dashboard.Apikeys = Apikeys;
Dashboard.Rules = Rules;

export declare namespace Dashboard {
  export {
    type DashboardGetLogsResponse as DashboardGetLogsResponse,
    type DashboardGetStatsResponse as DashboardGetStatsResponse,
    type DashboardGetLogsParams as DashboardGetLogsParams,
  };

  export {
    Apikeys as Apikeys,
    type ApikeyCreateResponse as ApikeyCreateResponse,
    type ApikeyListResponse as ApikeyListResponse,
    type ApikeyRevokeResponse as ApikeyRevokeResponse,
    type ApikeyCreateParams as ApikeyCreateParams,
  };

  export {
    Rules as Rules,
    type RuleObject as RuleObject,
    type RuleListResponse as RuleListResponse,
    type RuleDeleteResponse as RuleDeleteResponse,
    type RuleCreateParams as RuleCreateParams,
    type RuleUpdateParams as RuleUpdateParams,
  };
}
