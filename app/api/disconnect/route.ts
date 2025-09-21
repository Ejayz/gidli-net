import { pool2 } from "@/libs/db";

export async function POST(request: Request) {
  const pool = await pool2.connect();

  const { shadow_account_name } = await request.json();

  try {
    await pool.query("BEGIN");
    const hotspot_detail = await disconnectCustomer(shadow_account_name);
    const routerId = await getRouterId();

    if (!hotspot_detail) {
      return Response.json(
        `Error Disconnecting account. Please try again later.`,
        {
          status: 500,
        }
      );
    }

    const updateUser = await pool.query(
      "UPDATE tbl_user SET uptime_limit=$1,uptime=$2 ,router_id=$3 WHERE shadow_account_name=$4 and is_exist=true RETURNING id",
      [
        hotspot_detail[0]["limit-uptime"],
        hotspot_detail[0]["uptime"],
        routerId,
        shadow_account_name,
      ]
    );

    if (updateUser.rowCount > 0) {
      const remove = await removeUser(shadow_account_name);
      if (!remove) {
        await pool.query("ROLLBACK");
        pool.release();

        return Response.json(
          `Error Disconnecting account. Please try again later.`,
          {
            status: 500,
          }
        );
      }
      await pool.query("COMMIT");
      pool.release();
    }
  } catch (err) {
    await pool.query("ROLLBACK");
    pool.release();
    return Response.json(
      `Error Disconnecting account. Please try again later.`,
      {
        status: 500,
      }
    );
  }
  return Response.json("User disconnected successfully", { status: 200 });
}

const disconnectCustomer = async (shadow_account_name: Text | String) => {
  let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    ".query": [`?name=${shadow_account_name}`],
  });

  let response = await fetch("http://172.20.1.254/rest/ip/hotspot/user/print", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.json();

  if (data.length > 0) {
    return data;
  } else {
    return false;
  }
};

const getRouterId = async () => {
  let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
  };

  let response = await fetch(
    "http://172.20.1.254/rest/system/routerboard/print",
    {
      method: "POST",
      headers: headersList,
    }
  );

  let data = await response.json();

  return data[0]["serial-number"];
};

const removeUser = async (shadow_account_name: Text | String) => {
  let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
  };

  let response = await fetch(
    `http://172.20.1.254/rest/ip/hotspot/user/${shadow_account_name}`,
    {
      method: "DELETE",
      headers: headersList,
    }
  );

  let data = await response.status;

  return data;
};
