import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import client from "~/utils/db";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const user = (
    await client.query(
      /* sql */ `
      SELECT * FROM users
      WHERE email=$1;
    `,
      [email],
    )
  ).rows[0];

  if (!user) {
    throw createError({
      status: 401,
      statusText: "Unauthorized",
      message: "An account with that email does not exist.",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user!.password as string,
  );

  if (!isPasswordValid) {
    throw createError({
      status: 401,
      statusText: "Unauthorized",
      message: "The password you entered is incorrect.",
    });
  }

  const accessToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
      sub: user.id,
    },
    process.env.JWT_SECRET as string,
  );
  setCookie(event, "accessToken", accessToken, {
    httpOnly: false,
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
  });

  const refreshToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
      sub: user.id,
    },
    process.env.REFRESH_SECRET as string,
  );
  setCookie(event, "refreshToken", refreshToken, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax",
  });

  await client.query(
    /* sql */ `
      UPDATE users
      SET access_token=$1, refresh_token=$2
      WHERE email=$3;
    `,
    [accessToken, refreshToken, email],
  );

  return { success: true };
});
