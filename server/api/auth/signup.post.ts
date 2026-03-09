import bcrypt from "bcrypt";
import client from "~/utils/db";

export default defineEventHandler(async (event) => {
  const { username, email, password } = await readBody(event);

  const emailIsNotAvailable = await client.query(
    /* sql */ `
      SELECT * FROM users
      WHERE email=$1
    `,
    [email],
  );

  if (emailIsNotAvailable.rows.length !== 0) {
    throw createError({
      status: 403,
      statusText: "Forbidden",
      message: "That email is already in use.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

  await client.query(
    /* sql */ `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)`,
    [username, email, hashedPassword],
  );

  return { success: true };
});
