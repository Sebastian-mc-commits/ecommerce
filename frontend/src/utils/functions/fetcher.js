export const fetcher = (url) => fetch(url).then((response) => response.json());

const fetchData = async ({ url, method, failFetchOptions = {}, ...fetchBody }) => {
  let { messageTimeEndedFetch = "", maxTime = 10000 } = failFetchOptions;

  let request = {},
    result = {},
    errorFound = false,
    error = ""
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    messageTimeEndedFetch =
      "The server is taking too long to respond, please, wait or try again";
    controller.abort();
  }, maxTime);

  const startTime = performance.now();

  request = await fetch(url, {
    method,
    signal: controller.signal,
    ...fetchBody
  });

  const contentType = request?.headers?.get("Content-Type");

  if (contentType?.startsWith("application/json")) {
    result = await request.json();
  }

  const endTime = performance.now();

  clearTimeout(timeout);
  controller.abort();

  if (!request.ok && result && "message" in result) {
    errorFound = true;
    error = result.message;
  } else if (!request.ok) {
    errorFound = true;
    error = "Server error";
  }

  return {
    result,
    request,
    timeTaken: endTime - startTime,
    errorFound,
    error
  };
};

export default fetchData;
