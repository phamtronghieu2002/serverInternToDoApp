require("dotenv").config();
import InitApiRoute from "./route";
import express from "express";
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3000;


app.use(cors(
  {
    origin: ['http://localhost:5173'],
    credentials: true
  }
)) 
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
//route
InitApiRoute(app)


 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log("Server is started !!");