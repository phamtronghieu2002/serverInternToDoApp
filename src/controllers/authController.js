import * as authServices from "..//services/authService";
import con from "../db/db";

export const handleRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await authServices.register(username, password);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await authServices.login(username, password, res);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handeleGetProfile = async (req, res) => {
  try {
    const userid = req.user.id;

    const user = await authServices.getUserById(userid);

    console.log("user>>>>", user[0]);
    return res.status(200).json({
      data: {
        user: user[0],
        accesstoken: req.cookies.accesstoken,
        freshtoken: req.cookies.freshtoken,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handle_refresh_token = async (req, res) => {
  const refreshToken = req.cookies.freshtoken;

  if (!refreshToken) {
    return res.status(401).json({ message: "token invalid" });
  }
  authServices.refreshAccessToken(res, refreshToken);
};

export const handleLogout = (req, res) => {
  res.clearCookie("freshtoken").clearCookie("accesstoken");
  return res.status(200).json({ message: "logout success" });
};
