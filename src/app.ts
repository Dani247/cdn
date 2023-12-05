import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import routes from './controllers';
// CHECK PORT
const port = process.env.PORT;
if (!port) {
  throw new Error("PORT NOT SET AS AN ENV VARIABLE");
}
// CHECK STORAGE PATH
if (!process.env.STORAGE_PATH) {
  throw new Error("STORAGE_PATH NOT SET AS AN ENV VARIABLE");
}
// INITIALIZE APP
const app: express.Application = express();

// TODO: condig cors
app.use(cors());

// INITIALIZE ROUTES
routes(app);
// START
app.listen(port, () => console.log(`Server started on port ${port}`));