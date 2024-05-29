import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const veryfyUser = async (req, res, next) => {
  const accessToken = req.cookies.accesstoken ;
  
  if (accessToken) {
    try {
      const decoded_token = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );


      req.user = decoded_token;
      next();
    } catch (error) {
      return res.status(401).json({ message: "token invalid" });
    }
  } else {
    return res.status(401).json({ message: "token invalid" });
  }
};
