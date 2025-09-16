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

  const pool = await pool2.connect();

  const query = await pool.query(
    "SELECT * FROM tbl_user where email = $1 and is_exist=true",
    [email]
  );

  const validateAccount = bcrypt.compareSync(
    password,
    query.rows[0]?.password || ""
  );

  if (validateAccount) {
    const createToken = await jsonwebtoken.sign(
      {
        email: query.rows[0].email,
        id: query.rows[0].id,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      message: "Login successful",
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
