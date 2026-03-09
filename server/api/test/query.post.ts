export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("we received: ", body.name);
  return { success: true };
});
