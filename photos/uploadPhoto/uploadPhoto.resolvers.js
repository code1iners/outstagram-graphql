import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { extractHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtags = [];
        if (caption) {
          // note. parse caption.
          hashtags = extractHashtags(caption);
        }
        // note. get or create hashtags.
        // note. save the photo with the parsed hashtags.
        const photo = await client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtags.length > 0 && {
              hashtags: {
                connectOrCreate: hashtags,
              },
            }),
          },
        });

        // note. add the photo to the hashtags

        return {
          ok: true,
          photo,
        };
      }
    ),
  },
};
