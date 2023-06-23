import app from "./app.js";

app.listen(process.env.DATA_INJEST_PORT, async () => {
  console.log(
    `Data-Injest Server is running on port ${process.env.DATA_INJEST_PORT}`
  );
});
