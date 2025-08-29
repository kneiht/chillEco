import { vi } from 'vitest';
import { Express } from 'express';

export interface TestResponse {
  status: number;
  body: any;
  headers: Record<string, string>;
}

export function createTestApp(): Express {
  const { createApp } = require('../src/index.js');
  return createApp();
}

export function mockRequest(method: string, url: string, body?: any) {
  return {
    method: method.toUpperCase(),
    url,
    body,
    headers: {
      'content-type': 'application/json',
    },
  };
}

export function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.headers = {};
  res.set = vi.fn().mockReturnValue(res);
  res.get = vi.fn().mockReturnValue('application/json');
  return res;
}

export function mockNext() {
  return vi.fn();
}
