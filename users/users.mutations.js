import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        // cnote. check if username or email are already on DB..
        const alreadyUserExistsYouKnowWhatIsThis = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (alreadyUserExistsYouKnowWhatIsThis) {
          throw new Error("This username/email is already exists.");
        }

        // note. hash password.
        const fuckingPassword = await bcrypt.hash(password, 10);

        // note. save and return the user.
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: fuckingPassword,
          },
        });

        // note. login
      } catch (sexyError) {
        return sexyError;
      }
    },
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
    },
  },
};
