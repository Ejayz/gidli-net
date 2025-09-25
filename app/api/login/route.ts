import { pool2 } from "@/libs/db";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { JWTGenerator } from "@/libs/Tools";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

export async function POST(request: Request) {
  const { email, password } = await request.json();

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
    const token = await JWTGenerator(
      {
        email: query.rows[0].email,
        id: query.rows[0].id,
        shadow_account_name: query.rows[0]?.shadow_account_name,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      message:
        "Login successful. You may now close this window and start browsing !",
      code: 200,
    });
    response.cookies.set("token", token, {
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
