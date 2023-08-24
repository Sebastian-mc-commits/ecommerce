import { useEffect, useState } from "react";

export default function useFetch({ url, abortFetching, ...fetchOptions }) {
  const [fetchResult, setFetchResult] = useState({
    request: {},
    result: {},
    loading: true,
    hasError: false,
    error: ""
  });

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const request = await fetch(url, {
        signal: abortController.signal,
        ...fetchOptions
      });

      const contentType = request.headers.get("content-type");
      let result = {};
      let hasError = false;
      let error = "";
      if (contentType.startsWith("application/json")) {
        result = await request.json();
      }

      if (!request.ok && Object.values(result).length && "message" in result) {
        error = result.message;
        hasError = true;
      } else if (!request.ok) {
        error = "Server error";
        hasError = true;
      }

      setFetchResult((prevData) => {
        return {
          ...prevData,
          request,
          result,
          loading: false,
          hasError,
          error
        };
      });
    })();

    return () => abortController.abort();
  }, [url, fetchOptions]);

  return {
    ...fetchResult
  };
}
