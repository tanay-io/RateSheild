// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Ratesheild from 'ratesheild';

const client = new Ratesheild({
  bearerToken: 'My Bearer Token',
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource auth', () => {
  // Mock server tests are disabled
  test.skip('login: only required params', async () => {
    const responsePromise = client.auth.login({
      email: 'tanay@example.com',
      password: 'supersecretpassword',
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
  test.skip('login: required and optional params', async () => {
    const response = await client.auth.login({ email: 'tanay@example.com', password: 'supersecretpassword' });
  });

  // Mock server tests are disabled
  test.skip('register: only required params', async () => {
    const responsePromise = client.auth.register({
      email: 'tanay@example.com',
      name: 'Tanay',
      password: 'supersecretpassword',
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
  test.skip('register: required and optional params', async () => {
    const response = await client.auth.register({
      email: 'tanay@example.com',
      name: 'Tanay',
      password: 'supersecretpassword',
    });
  });
});
