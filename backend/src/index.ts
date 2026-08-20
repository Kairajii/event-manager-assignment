import app from "./app";
import { connectDB } from "./config/database";

const port = process.env.PORT || 8080;

const main = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

main();
