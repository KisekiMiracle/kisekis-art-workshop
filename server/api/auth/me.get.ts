import jwt from "jsonwebtoken";
import client from "~/utils/db";

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, "accessToken");
  const refreshToken = getCookie(event, "refreshToken");

  if (!accessToken && !refreshToken) {
    throw createError({ status: 401, message: "Not authenticated" });
  }

  // Try access token first
  try {
    const decoded = jwt.verify(
      accessToken!,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;
    const user = (
      await client.query(
        /* sql */ `SELECT id, username, email FROM users WHERE id=$1 AND access_token=$2`,
        [decoded.sub as string, accessToken!],
      )
    ).rows[0];

    if (!user) throw createError({ status: 401, message: "User not found" });
    return { user };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Access token invalid or expired, try refresh token
    if (!refreshToken) {
      throw createError({ status: 401, message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET as string,
      ) as jwt.JwtPayload;

      const user = (
        await client.query(
          /* sql */ `SELECT id, username, email FROM users WHERE id=$1 AND refresh_token=$2`,
          [decoded.sub as string, refreshToken],
        )
      ).rows[0];

      if (!user) throw createError({ status: 401, message: "User not found" });

      // Issue a new access token
      const newAccessToken = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, sub: user.id },
        process.env.JWT_SECRET as string,
      );
      setCookie(event, "accessToken", newAccessToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      await client.query(
        /* sql */ `UPDATE users SET access_token=$1 WHERE id=$2`,
        [newAccessToken, user.id as string],
      );

      return { user };
    } catch {
      throw createError({
        status: 401,
        message: "Session expired, please sign in again",
      });
    }
  }
});
