import client from "../../client";

export default {
  Query: {
    seeFollowing: async (_, { username, lastUserId }) => {
      const targetUser = client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!targetUser) {
        return {
          ok: false,
          error: "The user does not found.",
        };
      }

      const following = client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: lastUserId ? 1 : 0,
          ...(lastUserId && { cursor: { id: lastUserId } }),
        });

      return {
        ok: true,
        following,
      };
    },
  },
};
