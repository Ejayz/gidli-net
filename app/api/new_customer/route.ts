import { pool2 } from "@/libs/db";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import generateRandomString from "@/libs/randomGenerator";
export async function POST(req: NextRequest) {
  const pool = await pool2.connect();
  const { email, password } = await req.json();
  pool.query("BEGIN");
  const hashedPassword = await bcrypt.hashSync(password, 10);
  let generateUsername, generatePassword;

  do {
    generateUsername = await generateRandomString(12);
    generatePassword = await generateRandomString(12);
    var userExist = await getCustomerExist(generateUsername);
  } while (userExist);

  const res = await createCustomer(generateUsername, generatePassword);

  if (!res.detail && !res.error) {
    try {
      const checkEmail = await pool.query(
        "SELECT * FROM tbl_user WHERE email=$1",
        [email]
      );

      if (checkEmail.rowCount > 0) {
        await pool.query("ROLLBACK");
        pool.release();
        return Response.json(`Email already exist. Login instead ? `, {
          status: 500,
        });
      }

      await pool.query(
        "INSERT INTO tbl_user (email,password,shadow_account_name,shadow_account_password) VALUES ($1,$2,$3,$4)  RETURNING id",
        [email, hashedPassword, generateUsername, generatePassword]
      );
      await pool.query("COMMIT");
    } catch (err) {
      await pool.query("ROLLBACK");
      pool.release();
      return Response.json(`Error Creating account. Please try again later.`, {
        status: 500,
      });
    }
    return Response.json("User created successfully", { status: 200 });
  } else {
    await pool.query("ROLLBACK");
    pool.release();
    return Response.json(`Error Creating account. Please try again later.`, {
      status: 500,
    });
  }
}

const createCustomer = async (
  email: Text | String,
  password: Text | String
) => {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
  };

  let bodyContent = JSON.stringify({
    name: email,
    password: password,
    "limit-uptime": "05:00:00",
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

const getCustomerExist = async (email: Text | String) => {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Basic YWRtaW46cmFuZG9tRGRvczEuY29t",
  };

  let bodyContent = JSON.stringify({
    ".query": ["?name=" + email],
  });

  let response = await fetch("http://172.20.1.254/rest/ip/hotspot/user/print", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.json();
  return data.length == 0 ? false : true;
};
