import * as yup from "yup";

const UserSignUp = {
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().length(13).optional(),
  password: yup.string().required(),
};

const UserLogin = {
  email: yup.string().email().required(),
  password: yup.string().required(),
};

const RefreshToken = {
  email: yup.string().email().required(),
  refreshToken: yup.string().length(21).required(),
};

export const UserSignUpSchema = new yup.ObjectSchema(UserSignUp);
export const UserLoginSchema = new yup.ObjectSchema(UserLogin);
export const RefreshTokenSchema = new yup.ObjectSchema(RefreshToken);
