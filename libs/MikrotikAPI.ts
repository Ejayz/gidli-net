export const AuthenticateHotspot = async (
  shadow_account_name: string | Text,
  shadow_account_password: string | Text,
  ip: string | Text,
  authorization: string | Text
) => {
  try {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Basic ${authorization}`,
    };

    let bodyContent = JSON.stringify({
      ip: ip,
      user: shadow_account_name,
      password: shadow_account_password,
    });

    let response = await fetch(
      "http://172.20.1.254/rest/ip/hotspot/active/login",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    let data = await response.text();
    console.log(data);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createCustomer = async (
  email: Text | String,
  password: Text | String,
  limit_uptime: Text | String = "05:00:00",
  uptime: Text | String = "00:00:00",
  authorization: String | Text
) => {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Basic ${authorization}`,
  };

  let bodyContent = JSON.stringify({
    name: email,
    password: password,
    "limit-uptime": limit_uptime,
    comment: JSON.stringify({
      created_at: new Date().toISOString(),
    }),
  });

  let response = await fetch("http://172.20.1.254/rest/ip/hotspot/user/add", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.json();
  return data;
};
