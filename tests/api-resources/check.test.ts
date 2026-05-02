// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Ratesheild from 'ratesheild';

const client = new Ratesheild({
  bearerToken: 'My Bearer Token',
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource check', () => {
  // Mock server tests are disabled
  test.skip('enforceRateLimit: only required params', async () => {
    const responsePromise = client.check.enforceRateLimit({
      key: 'user:42',
      limit: 100,
      window: 60,
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('enforceRateLimit: required and optional params', async () => {
    const response = await client.check.enforceRateLimit({
      key: 'user:42',
      limit: 100,
      window: 60,
      algo: 'fixed',
    });
  });
});
