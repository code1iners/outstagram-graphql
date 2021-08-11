import client from "../client";
import { protectedResolver } from "./users.utils";

export default {
  User: {
    totalFollowing: ({ id }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => {
      console.log(id, loggedInUser);
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      return client.user.count({
        where: { id: loggedInUser.id, following: { some: { id } } },
      });
    },
    photos: ({ id }, { lastPhotoId }) => {
      return client.photo.findMany({
        where: { userId: id },
        take: 5,
        skip: lastPhotoId ? 1 : 0,
        ...(lastPhotoId && { cursor: { id: lastPhotoId } }),
      });
    },
  },
};
