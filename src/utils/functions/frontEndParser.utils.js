import { stringify } from "querystring";

const buildFrontEndUrl = ({ url = [], params = {} }) => {
  let parseUrl = url.join("/");

  if (Object.values(params).length) {
    parseUrl += `?${stringify(params)}`;
  }

  return parseUrl;
};

export default buildFrontEndUrl;
