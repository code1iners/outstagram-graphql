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
      } catch (sexyError) {
        return sexyError;
      }
    },
  },
};
