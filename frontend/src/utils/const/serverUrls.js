export const serverPort = 4000;
export const serverUrl = `http://localhost:${serverPort}/api`;
import { stringify } from "querystring";

const buildServerUrl = ({
  url = [],
  params = {},
  paramsAsString = "",
  useServerUrl = true
}) => {
  let parseUrl = [useServerUrl ? serverUrl : "", ...url].join(
    url[0] === "/" ? "" : "/"
  );

  if (paramsAsString) {
    parseUrl += `?${paramsAsString}`;
  } else if (Object.values(params).length) {
    parseUrl += `?${stringify(params)}`;
  }

  return parseUrl;
};
export default buildServerUrl;
