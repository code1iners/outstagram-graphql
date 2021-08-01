import bcrypt from "bcrypt";
import client from "../../client";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // note. find user with args.username.
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "The user does not found.",
        };
      }
      // note. check password with args.password.
      const passwordFuckingValid = await bcrypt.compare(
        password,
        user.password
      );
      if (!passwordFuckingValid) {
        return {
          ok: false,
          error: "Incorrect password.",
        };
      }
      // note. issue a token and send it to the user.
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
