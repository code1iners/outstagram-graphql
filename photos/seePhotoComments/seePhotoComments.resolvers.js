import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_, { id, lastCommentId }) =>
      client.comment.findMany({
        where: { photoId: id },
        orderBy: { createdAt: "desc" },
        skip: lastCommentId ? 1 : 0,
        take: 5,
        ...(lastCommentId && { cursor: { id: lastCommentId } }),
      }),
  },
};
