import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { extractHashtags } from "../photos.utils";

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const foundPhoto = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: { hashtags: { select: { hashtag: true } } },
        });

        if (!foundPhoto) {
          return {
            ok: false,
            error: "The photo does not found.",
          };
        }

        await client.photo.update({
          where: { id: foundPhoto.id },
          data: {
            caption,
            hashtags: {
              disconnect: foundPhoto.hashtags,
              connectOrCreate: extractHashtags(caption),
            },
          },
        });

        return {
          ok: true,
        };
      }
    ),
  },
};
