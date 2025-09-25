import jsonwebtoken from "jsonwebtoken";

export const ObtainIP = async (request: Request) => {
  const requestorIP: string =
    request.headers.get("x-forwarded-for")?.split("::ffff:")[1] || "";
  return requestorIP;
};

export const JWTGenerator = async (
  payload: object,
  jwtSecret: string,
  options: object
) => {
  const createToken = await jsonwebtoken.sign(payload, jwtSecret,options);
  return createToken;
};
