import { pool2 } from "@/libs/db";
import bcrypt from "bcrypt";
import { json } from "stream/consumers";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const requestorIP: string =
    request.headers.get("x-forwarded-for")?.split("::ffff:")[1] || "";

  const pool = await pool2.connect();

  const query = await pool.query(
    "SELECT password,shadow_account_name,shadow_account_password,uptime_limit,uptime FROM tbl_user where email = $1 and is_exist=true",
    [email]
  );

  const validateAccount = bcrypt.compareSync(
    password,
    query.rows[0]?.password || ""
  );

  if (validateAccount) {
    const createAcc = await createCustomer(
      query.rows[0].shadow_account_name,
      query.rows[0].shadow_account_password,
      query.rows[0].limit_uptime,
      query.rows[0].uptime
    );
    console.log(createAcc);
   
    const loginHotspot = await AuthenticateHotspot(
      query.rows[0].shadow_account_name,
      query.rows[0].shadow_account_password,
      requestorIP
    );
    
    if (!loginHotspot) {
      return NextResponse.json({
        message: "Error authenticating to server,Please contact operator !",
        code: 500,
      });
    }
    const createToken = await jsonwebtoken.sign(
      {
        email: query.rows[0].email,
        id: query.rows[0].id,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      message:
        "Login successful. You may now close this window and start browsing !",
      code: 200,
    });
    response.cookies.set("token", createToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 day
    });
    return response;
  } else {
    return NextResponse.json({
      message: "Username or password is incorrect !",
      code: 401,
    });
  }
}
const AuthenticateHotspot = async (
  shadow_account_name: string | Text,
  shadow_account_password: string | Text,
  ip: string | Text
) => {
  try {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
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

const createCustomer = async (
  email: Text | String,
  password: Text | String,
  limit_uptime: Text | String = "05:00:00",
  uptime: Text | String = "00:00:00"
) => {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
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


