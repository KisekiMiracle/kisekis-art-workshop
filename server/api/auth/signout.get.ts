import client from "~/utils/db";

export default defineEventHandler(async (event) => {
  deleteCookie(event, "accessToken");
  deleteCookie(event, "refreshToken");

  await client.query(
    /* sql */ `
      INSERT INTO users (accessToken, refreshToken)
      VALUES ($1, $2)
    `,
    [null, null],
  );

  return { success: true };
});
