class APIError extends Error {
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

async function http<T>(path: string, config: RequestInit): Promise<T> {
  // if the path is not a full url, then it is a relative path
  const prefixedPath = path.startsWith('http')
    ? path
    : `${document.location.origin}${import.meta.env.BASE_URL}/api${path}`;

  const request = new Request(prefixedPath, config);
  const response = await fetch(request);

  if (!response.ok) {
    // TODO: display notification to user

    throw new APIError({
      name: String(response.status),
      message: response.statusText,
      request,
      response,
    });
  }

  return response.json();
}

export function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: 'get', ...config };
  return http<T>(path, init);
}

export function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = { method: 'post', body: JSON.stringify(body), ...config };
  return http<U>(path, init);
}

export function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = { method: 'put', body: JSON.stringify(body), ...config };
  return http<U>(path, init);
}
