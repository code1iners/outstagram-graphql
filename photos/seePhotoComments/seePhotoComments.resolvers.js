import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_, { id, lastCommentId }) =>
      client.comment.findMany({
        where: { photoId: { id } },
        orderBy: { createdAt: "desc" },
        skip: 1,
        take: 5,
        ...(lastCommentId && { cursor: { id: lastCommentId } }),
      }),
  },
};
