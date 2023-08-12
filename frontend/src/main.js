import nav from "./components/navigation/nav.js";
nav();

import {
  Home,
  Request,
  Recommended,
  Trending,
} from "./components/cimaTube/api.js";
import { apiUrl, options } from "./components/cimaTube/url.js";
import { Decrypt } from "./utils/encryption/encrypt.js";
import { RequestData } from "./components/cimaTube/Request.js";
(async () => {
  let res = await Home(apiUrl, options);
  console.log("Home");
  console.table(res);

  res = await Trending(apiUrl, options);
  console.log("Trending");
  console.table(res);

  res = await Recommended(apiUrl, options);
  console.log("Recommended");
  console.table(res);

    const data = RequestData({
      query: "Kill Bill",
      email: "koko@outlok.com",
      mediaHandle: "@twiter/kokij",
    });
    res = await Request(apiUrl, data);
    console.table(res);
})();
