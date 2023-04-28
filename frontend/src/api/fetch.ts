/* eslint-disable guard-for-in */
import { getCSRFValue } from './csrf';
import Errors from './errorlog';

export class APIError extends Error {
  name: string;

  request: Request;

  response: Response;

  constructor({
    name,
    message,
    request,
    response,
  }: {
    name: string;
    message: string;
    request: Request;
    response: Response;
  }) {
    super(message);

    this.name = name;
    this.request = request;
    this.response = response;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

const getApiBaseUrl = (url?: string) => {
  if (url === undefined) {
    return '';
  }

  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }

  return url;
};

const API_BASE_URL = getApiBaseUrl(import.meta.env.API_BASE_URL);

async function http<T>(path: string, config: RequestInit): Promise<T> {
  const prefixedPath = path.startsWith('http') ? path : `${API_BASE_URL}/api${path}`.replace(/\/+/g, '/');

  const request = new Request(prefixedPath, config);
  const response = await fetch(request);

  if (!response.ok) {
    Errors.log({ response });

    const error = new APIError({
      name: String(response.status),
      message: response.statusText,
      request,
      response,
    });
    Errors.log(error);
    throw error;
  }

  return response.json();
}

export function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: 'get', ...config };
  return http<T>(path, init);
}

type JsonFormData = { [arbitrary: string]: string | boolean };

function jsonToFormData(body: JsonFormData): FormData {
  const formData = new FormData();

  // eslint-disable-next-line no-restricted-syntax
  for (const key in body) {
    if (body[key] !== undefined) {
      if (typeof body[key] === 'boolean') {
        formData.append(key, body[key] ? 'true' : 'false');
      } else {
        formData.append(key, body[key] as string);
      }
    }
  }

  return formData;
}

export function post<T extends JsonFormData, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = {
    method: 'post',
    body: jsonToFormData(body),
    headers: {
      'X-CSRFTOKEN': getCSRFValue(),
      ...config?.headers,
    },
  };
  return http<U>(path, init);
}

export function put<T extends JsonFormData, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = {
    method: 'put',
    body: jsonToFormData(body),
    ...config,
    headers: {
      'X-CSRFTOKEN': getCSRFValue(),
      ...config?.headers,
    },
  };
  return http<U>(path, init);
}
