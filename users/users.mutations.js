import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // cnote. check if username or email are already on DB..
      const foundUser = await client.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      // note. hash password.

      // note. save and return the user.
    },
  },
};
