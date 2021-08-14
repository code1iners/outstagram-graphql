import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const foundPhoto = await client.photo.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!foundPhoto) {
        return {
          ok: false,
          error: "The photo does not found.",
        };
      } else if (foundPhoto.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not authorized.",
        };
      } else {
        await client.photo.delete({ where: { id } });
      }

      return {
        ok: true,
      };
    }),
  },
};
