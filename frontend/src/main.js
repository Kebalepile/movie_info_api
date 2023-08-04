import { apiUrl, options } from "./components/cimaTube/url.js";
import { RequestData } from "./components/cimaTube/Request.js";
import { home, recommended, trending } from "./components/cimaTube/api.js";
(async () => {
  let response;
  response = await home(apiUrl, options);
  console.table(response);
  response = await recommended(apiUrl, options);
  console.table(response);
  response = await trending(apiUrl, options);
  console.table(response);
  // await request(apiUrl, RequestData);
})();
