// Compatibility shim to route legacy useAPI calls through useApiService
// Supports callbacks: onResponse, onResponseError
export async function useAPI(url: string | (() => string), options: any = {}) {
  const requestUrl = typeof url === "function" ? url() : url;
  const method: string = (options?.method || "get").toLowerCase();
  const body = options?.body;

  try {
    let data: any;
    if (method === "get") {
      data = await useApiService.get(requestUrl);
    } else if (method === "post") {
      data = await useApiService.post(requestUrl, body);
    } else if (method === "put") {
      data = await useApiService.put(requestUrl, body);
    } else if (method === "patch") {
      data = await useApiService.patch(requestUrl, body);
    } else if (method === "delete") {
      data = await useApiService.remove(requestUrl);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    if (typeof options?.onResponse === "function") {
      options.onResponse({ response: { status: 200, _data: data } });
    }

    return data;
  } catch (err) {
    if (typeof options?.onResponseError === "function") {
      options.onResponseError(err);
    }
    throw err;
  }
}
