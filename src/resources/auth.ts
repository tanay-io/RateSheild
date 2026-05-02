// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * User registration and login (public endpoints)
 */
export class Auth extends APIResource {
  /**
   * Validates credentials against the stored bcrypt hash and returns a signed JWT
   * together with the user's profile data.
   *
   * @example
   * ```ts
   * const authResponse = await client.auth.login({
   *   email: 'tanay@example.com',
   *   password: 'supersecretpassword',
   * });
   * ```
   */
  login(body: AuthLoginParams, options?: RequestOptions): APIPromise<AuthResponse> {
    return this._client.post('/auth/login', { body, ...options, __security: {} });
  }

  /**
   * Creates a new user account, hashes the password with bcrypt, and returns a
   * signed JWT together with the user's profile data.
   *
   * Returns `409 Conflict` if the email address is already registered.
   *
   * @example
   * ```ts
   * const authResponse = await client.auth.register({
   *   email: 'tanay@example.com',
   *   name: 'Tanay',
   *   password: 'supersecretpassword',
   * });
   * ```
   */
  register(body: AuthRegisterParams, options?: RequestOptions): APIPromise<AuthResponse> {
    return this._client.post('/auth/register', { body, ...options, __security: {} });
  }
}

export interface AuthResponse {
  /**
   * JWT bearer token. Valid for 24 hours.
   */
  token?: string;

  user?: UserDto;
}

export interface UserDto {
  id?: number;

  email?: string;

  name?: string;
}

export interface AuthLoginParams {
  email: string;

  password: string;
}

export interface AuthRegisterParams {
  email: string;

  name: string;

  password: string;
}

export declare namespace Auth {
  export {
    type AuthResponse as AuthResponse,
    type UserDto as UserDto,
    type AuthLoginParams as AuthLoginParams,
    type AuthRegisterParams as AuthRegisterParams,
  };
}
