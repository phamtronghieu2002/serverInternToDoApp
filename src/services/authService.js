import dotenv from "dotenv";
import { comparePassword, hashPassword, } from "../ultils/crypto.js";
import { create_access_token, create_fresh_token } from "../ultils/jwt.js";
import con from "../db/db.js";

export const register = (username, password) => {
   
  return new Promise(async (resolve, reject) => {
    try {
      const passwordHash = await hashPassword(password);

      con.query(
        "insert into users (username, password) values (?,?)",
        [username, passwordHash],
        (err, result) => {
          if (err) {
            reject(err);
          }
          console.log(result);
          resolve(result);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const login = (username, password) => {
  return new Promise(async (resolve, reject) => {
    const passwordHash = await hashPassword(password);
    console.log(passwordHash);
    try {
    //   const password = await comparePassword(password, passwordHash);
      con.query(
        "select * from users where username = ?",
        [username],
        (err, result) => {
          if (err) {
            reject(err);
          }
          console.log(result);
          resolve(result);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
