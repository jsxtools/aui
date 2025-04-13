/** Performs an HTTP request using XMLHttpRequest, mimicking the Fetch API's behavior. */
export declare const fetch: (
/** Resource to fetch, which can be a Request object, URL, or string. */
resource: string | URL | Request, 
/** Optional configuration including headers, method, body, and signal for handling progress and abortion. */
options?: RequestInit) => Promise<Response>;
