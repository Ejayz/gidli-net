import { pool2 } from "@/libs/db";
import { insert } from "formik";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { hash } from "crypto";
export async function POST(req: NextRequest) {
  const pool = await pool2.connect();
  const { email, password } = await req.json();
  pool.query("BEGIN");
  const hashedPassword = await bcrypt.hashSync(password, 10);
  const insertUser = await pool.query(
    "INSERT INTO tbl_user (email,password) VALUES ($1,$2)  RETURNING id",
    [email, hashedPassword]
  );
  const customerExist = await getCustomerExist(email);
  if (customerExist) {
    await pool.query("ROLLBACK");
    pool.release();
    return Response.json("User already exists", { status: 400 });
  }
  const res = await createCustomer(email, password, insertUser.rows[0].id);

  if (!res.detail && !res.error) {
    await pool.query("COMMIT");
    pool.release();
    return Response.json("User created successfully", { status: 200 });
  } else {
    await pool.query("ROLLBACK");
    pool.release();
    return Response.json(`Error Creating account. Please try again later.`, {
      status: 500,
    });
  }
}

const createCustomer = async (email: Text, password: Text, uuid: Text) => {
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
      uuid: uuid,
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

const getCustomerExist = async (email: Text) => {
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
