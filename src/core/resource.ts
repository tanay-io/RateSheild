// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Ratesheild } from '../client';

export abstract class APIResource {
  protected _client: Ratesheild;

  constructor(client: Ratesheild) {
    this._client = client;
  }
}
