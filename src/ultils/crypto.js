import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = async (password) => {
  return  bcrypt.hashSync(password, saltRounds)
};

export const comparePassword =  async(password, hash) => {
  return  bcrypt.compareSync(password, hash);
};
