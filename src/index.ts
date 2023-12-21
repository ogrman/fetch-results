/// <reference lib="dom" />

import { Ok, Err, Result } from 'ts-results';

export async function fetchr(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Result<ResponseR, ConnectionError>> {
  try {
    const response = await fetch(input, init);
    return new Ok(new ResponseR(response));
  } catch (error: any) {
    return new Err({ connectionError: error.cause.toString() });
  }
}

export type ConnectionError = { connectionError: string };

export type ParseError = { parseError: string };

export class ResponseR {
  readonly type: ResponseType;
  readonly url: string;
  readonly status: number; 
  readonly ok: boolean;
  readonly statusText: string;
  readonly headers: Headers;

  constructor(private response: Response) {
    this.type = response.type;
    this.url = response.url;
    this.status = response.status;
    this.ok = response.ok;
    this.statusText = response.statusText;
    this.headers = response.headers;
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return this.response.arrayBuffer();
  }

  blob(): Promise<Blob> {
    return this.response.blob();
  }

  clone(): ResponseR {
    return new ResponseR(this.response.clone());
  }

  async formData(): Promise<Result<FormData, ParseError>> {
    try {
      return new Ok(await this.response.formData());
    } catch (error: any) {
      return new Err({ parseError: error.toString() });
    }
  }

  async json(): Promise<Result<unknown, ParseError>> {
    try {
      return new Ok(await this.response.json());
    } catch (error: any) {
      return new Err({ parseError: error.toString() });
    }
  }

  text(): Promise<string> {
    return this.response.text();
  }
}
