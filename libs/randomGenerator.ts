import { randomBytes } from "crypto";

export default function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(bytes[i] % charactersLength);
  }

  return result;
}
