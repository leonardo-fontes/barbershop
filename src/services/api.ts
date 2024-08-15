/* eslint-disable @typescript-eslint/no-explicit-any */
const { API_URI = "https://5158-179-125-140-129.ngrok-free.app" } = process.env;

type RequestInitCustom = Omit<RequestInit, "method" | "body">;

export type FetchCustomResponse<T> =
  | {
      ok: true;
      data: T | null;
    }
  | {
      ok: false;
      data: ApiCustomErrorMessage | null;
    };

function makeUrl(path = "") {
  return [API_URI, ...path.trim().split("/").filter(Boolean)].join("/");
}

async function makeInit(options: RequestInit): Promise<RequestInit> {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return {
    cache: "no-store",
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
      'ngrok-skip-browser-warning':'69420',
    },
  };
}

async function customFetch<T>(
  path: string,
  init: RequestInit
): Promise<FetchCustomResponse<T>> {
  try {
    const request = await fetch(path, init);

    if (!Number(request.headers.get("Content-Length"))) {
      return {
        ok: !!request.ok,
        data: null,
      };
    }

    const response = await request.json();
    if (request.ok) {
      return {
        ok: true,
        data: response as T,
      };
    }

    throw new ApiCustomError(response);
  } catch (error) {
    return {
      ok: false,
      data: (error instanceof ApiCustomError
        ? error
        : new ApiCustomError()
      ).getMessage(),
    };
  }
}

const api = {
  get: async <T = any>(path: string, init?: RequestInitCustom) =>
    customFetch<T>(
      makeUrl(path),
      await makeInit({
        ...init,
        method: "GET",
      })
    ),
  post: async <T = any>(
    path: string,
    body: object | FormData,
    init?: RequestInitCustom
  ) =>
    customFetch<T>(
      makeUrl(path),
      await makeInit({
        ...init,
        method: "POST",
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
      })
    ),
  put: async <T = any>(
    path: string,
    body: object | FormData,
    init?: RequestInitCustom
  ) =>
    customFetch<T>(
      makeUrl(path),
      await makeInit({
        ...init,
        method: "PUT",
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
      })
    ),
  patch: async <T = any>(
    path: string,
    body: object | FormData,
    init?: RequestInitCustom
  ) =>
    customFetch<T>(
      makeUrl(path),
      await makeInit({
        ...init,
        method: "PATCH",
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
      })
    ),
  delete: async <T = any>(path: string, init?: RequestInitCustom) =>
    customFetch<T>(
      makeUrl(path),
      await makeInit({
        ...init,
        method: "DELETE",
      })
    ),
};

export default api;

export type ApiCustomErrorOptions = {
  statusCode: number;
  message: string[] | string;
  errors: any[];
};

export type ApiCustomErrorMessage = {
  statusCode: number;
  message: string;
  errors: string[];
};

export class ApiCustomError extends Error {
  statusCode: number;
  message: string;
  errors: string[];

  constructor(options?: ApiCustomErrorOptions) {
    super();
    this.statusCode = options?.statusCode || 500;
    this.errors = options?.errors || ["Internal server error"];
    this.message = "Erro ao realizar a requisição. Tente novamente!";
    if (options?.message) {
      if (Array.isArray(options?.message) && options?.message?.[0]) {
        this.message = options.message[0];
      }
      if (typeof options?.message === "string" && options?.message) {
        this.message = options.message;
      }
    }
    if (options?.errors) {
      if (Array.isArray(options?.errors) && options?.errors?.[0]) {
        if (typeof options?.errors?.[0] === "object") {
          const error = options.errors[0];
          this.message = error.message;
        } else if (typeof options?.errors?.[0] === "string") {
          this.message = options.errors[0];
        }
      }
      if (typeof options?.errors === "string" && options?.errors) {
        this.message = options.errors[0];
      }
    }
  }

  getMessage(): ApiCustomErrorMessage {
    return {
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}
