import client from "~/utils/db";

export default defineEventHandler(async () => {
  try {
    await client.query(/* sql */ `
    CREATE TABLE users (
      id UUID NOT NULL DEFAULT gen_random_uuid(),
      username VARCHAR(255) NOT NULL,
      email  VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      access_token VARCHAR(255),
      refresh_token VARCHAR(255)
    );
  `);
  } catch (err) {
    console.error(
      "Full DB error:",
      JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
    );
    throw err;
  }
  return { success: true };
});
