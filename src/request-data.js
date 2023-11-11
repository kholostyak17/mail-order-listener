const getHeaders = (auth) => {
  let mainHeaders = {
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "pl",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Origin: process.env.REQUEST_HEADERS_ORIGIN,
    Referer: process.env.REQUEST_HEADERS_REFERER,
    "Sec-Ch-Ua":
      '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  };

  if (auth?.access_token) {
    mainHeaders["Authorization"] = `${auth.token_type} ${auth.access_token}`;
    mainHeaders["Cookie"] = getCookie(auth);
  } else {
    mainHeaders["Cookie"] = getCookie();
  }

  return mainHeaders;
};

const getCookie = (auth) => {
  let cookie =
    "gaVisitorUuid=0a4fed99-b7e2-4821-9199-d5108d472078; _ga=GA1.1.1231055181.1694001717; _ga_3R28DDTX1M=GS1.2.1695750323.2.0.1695750323.60.0.0; _hjSessionUser_292553=eyJpZCI6IjkyZWYzNDk1LTE3YTctNTg0YS1iZTkxLTZhYmQ2MjE0NjFjMyIsImNyZWF0ZWQiOjE2OTQwMDE3MTczNTcsImV4aXN0aW5nIjp0cnVlfQ==; _clck=rxvw6y|2|ffc|0|1364; _gcl_au=1.1.573570452.1697809776; intercom-device-id-ckx4ffh4=073404b9-2933-450a-b928-66325ae742be; _ga_WRG93Y401L=GS1.1.1698328347.5.1.1698328525.57.0.0; intercom-session-ckx4ffh4=WUpzNVVvRldYN2V1UVlnU2JHa2ZVMk5GQU83aHZTKzJwSFVyVGNOQzRsNktTTzRkdWJUdThvT291Qkk3bDc4bC0tY3dIeWhHK1IrZ0ZocndwTURwdGhJdz09--59f11d7fedfbd8fcc68f6004a5df8edc2d3b2896";
  if (auth?.access_token) {
    cookie = cookie.concat(
      `; token=%7B%22token_type%22%3A%22${auth.token_type}%22%2C%22expires_in%22%3A${auth.expires_in}%2C%22access_token%22%3A%22${auth.access_token}%22%2C%22refresh_token%22%3A%22${auth.refresh_token}%22%7D`
    );
  }
  return cookie;
};

module.exports = { getHeaders, getCookie };
