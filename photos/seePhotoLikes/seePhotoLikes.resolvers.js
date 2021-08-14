import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { photoId }) => {
      const likes = await client.like.findMany({
        where: {
          photoId,
        },
        select: {
          user: { select: { username: true } },
        },
      });

      return likes.map((like) => like.user);
    },
  },
};
