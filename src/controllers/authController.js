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
      message: "Register success",
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
      const result = await authServices.login(username, password);
      return res.status(200).json({
        message: "Register success",
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };