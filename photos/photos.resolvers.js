import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    commentCount: ({ id }) => client.comment.count({ where: { photoId: id } }),
    comments: ({ id }) =>
      client.comment.findMany({
        where: { photoId: id },
        include: { user: true },
      }),
    isMine: ({ userId }, _, { loggedInUser }) =>
      loggedInUser ? userId === loggedInUser.id : false,
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: { id: true },
      });

      return ok ? true : false;
    },
  },
  Hashtag: {
    photos: ({ id }, { lastPhotoId }) => {
      return client.hashtag.findUnique({ where: { id } }).photos({
        take: 5,
        skip: lastPhotoId ? 1 : 0,
        ...(lastPhotoId && { cursor: { id: lastPhotoId } }),
      });
    },
    totalPhotos: ({ id }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};
