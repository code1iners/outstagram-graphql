import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
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
