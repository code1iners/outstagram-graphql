import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }

    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      throw new Error("Authorization invalid.");
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
