import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword, lastUserId }) => {
      if (keyword.length < 4) {
        return {
          ok: false,
          error: "Keywords must be at least 4 characters long.",
        };
      }

      const matchedUsers = client.user.findMany({
        where: {
          OR: [
            {
              username: {
                startsWith: keyword.toLowerCase(),
              },
            },
            {
              firstName: {
                startsWith: keyword,
              },
            },
            {
              lastName: {
                startsWith: keyword,
              },
            },
          ],
        },
        take: 5,
        skip: 1,
        ...(lastUserId && { cursor: { id: lastUserId } }),
      });

      return {
        ok: true,
        users: matchedUsers,
      };
    },
  },
};
