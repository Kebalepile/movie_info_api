//

const apiUrl = "http://127.0.0.1:8080/",
  options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  };

async function home(url) {
  try {
    const res = await fetch(url, options);
    // console.log(res.headers);
    // console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function trending(url) {
  try {
    const res = await fetch(url + "trending", options);
    // console.log(res.headers);
    // console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function recommended(url) {
  try {
    const res = await fetch(url + "recommended", options);
    // console.log(res.headers);
    // console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
async function request(url, data) {
  try {
    const res = await fetch(url + "request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });

    // console.log(res);
    const resData = await res.json();
    console.log(resData);
  } catch (err) {
    console.log(err);
  }
}

const RequestData = {
  date: new Date().getDate(),
  query: "Borat",
  email: "kmotshoana@gmail.com",
  mediaHandle: "@facebook.com",
};

(async () => {
  await home(apiUrl);
  await recommended(apiUrl);
  await trending(apiUrl);
//   await request(apiUrl, RequestData);

})();
