import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { comparePassword, hashPassword } from "../ultils/crypto.js";
import { create_access_token, create_fresh_token } from "../ultils/jwt.js";
import con from "../db/db.js";
import { json, raw } from "body-parser";

const rawData = (data) => {
  return JSON.parse(JSON.stringify(data));
};
const checkExistUser = (username) => {
  return new Promise((resolve, reject) => {
    con.query(
      "select username from users where username = ?",
      [username],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result).length > 0 ? true : false);
      }
    );
  });
};

const checkUserNameExit = (username) => {
  return new Promise((resolve, reject) => {
    con.query(
      "select * from users where username = ?",
      [username],
      (err, result) => {
        if (err) {
          reject(err);
        }
        return resolve(result.length > 0 ? rawData(result[0]) : false);
      }
    );
  });
};

const saveTokenOnBrowser = (res, access_token, fresh_token) => {
  res.cookie("accesstoken", access_token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });
  res.cookie("freshtoken", fresh_token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });
};

const saveFreshTokenOnUserTable = (userId, fresh_token) => {
  return new Promise((resolve, reject) => {
    con.query(
      "update users set  freshtoken = ? where id = ?",
      [fresh_token, userId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log("result", result);
        return resolve(result.length > 0 ? true : false);
      }
    );
  });
};

const getUserByFreshToken = (freshToken) => {
  return new Promise((resolve, reject) => {
    con.query(
      "select * from users where freshtoken = ?",
      [freshToken],
      (err, result) => {
        if (err) {
          reject(err);
        }
        return resolve(result.length > 0 ? rawData(result[0]) : false);
      }
    );
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    con.query("select * from users where id = ?", [id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(rawData(result));
    });
  });
};

export const updateFreshTokenInDB = async (userid, freshToken) => {
  return new Promise((resolve, reject) => {
    con.query(
      "update users set freshtoken = ? where id = ?",
      [freshToken, userid],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.length > 0 ? true : false);
      }
    );
  });
};

export const refreshAccessToken = async (res, freshtoken) => {
  try {
    const user = await getUserByFreshToken(freshtoken);
    console.log("user >> ", user);
    console.log("freshtoken >> ", freshtoken);
    if (user) {
      const decoded_freshToken = jwt.verify(
        freshtoken,
        process.env.FRESH_TOKEN_SECRET
      );

      const expiresIn = decoded_freshToken.exp - Math.floor(Date.now() / 1000);
      delete decoded_freshToken.exp;
      delete decoded_freshToken.iat;
      const new_fresh_token = create_fresh_token(decoded_freshToken, expiresIn);
      const new_access_token = create_access_token(decoded_freshToken, "1m");

      saveTokenOnBrowser(res, new_access_token, new_fresh_token);
      await updateFreshTokenInDB(user.id, new_fresh_token);

      return res.status(200).json("refresh token successfull!!");
    }
    return res.status(401).json({ message: "unauthorized" });
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
  }
};

export const register = (username, password) => {
  return new Promise(async (resolve, reject) => {
    const userExit = await checkExistUser(username);
    if (userExit) {
      resolve({
        message: "User is already exist please change username",
        errCode: 1,
      });
    } else {
      const passwordHash = await hashPassword(password);
      con.query(
        "insert into users (username, password,freshtoken) values (?, ?,?)",
        [username, passwordHash, ""],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve({
            message: "Register success",
            errCode: 0,
          });
        }
      );
    }
  });
};

export const login = (username, password, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      //   const password = await comparePassword(password, passwordHash);
      const userExit = await checkUserNameExit(username);

      if (!userExit) {
        return resolve({
          message: "User is not exist",
          errCode: 1,
        });
      }
      if (await comparePassword(password, userExit.password)) {
        delete userExit.password;
        delete userExit.freshtoken;
        const access_token = create_access_token(userExit, "1m");
        const fresh_token = create_fresh_token(userExit, "7d");
        const { id, username } = rawData(userExit);

        saveTokenOnBrowser(res, access_token, fresh_token);
        await saveFreshTokenOnUserTable(id, fresh_token);
        return resolve({
          errCode: 0,
          message: "Login success",
          access_token,
          fresh_token,
          id,
          username,
        });
      }
      return resolve({
        errCode: 2,
        message: "Password is incorrect",
      });
    } catch (error) {
      return reject(error);
    }
  });
};
