import app from "./app.js";
import serverless from "serverless-http";

// Wrap your Express app with serverless-http
export const handler = serverless(app);
