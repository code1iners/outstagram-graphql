import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser }) => {
        const foundComment = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!foundComment) {
          return {
            ok: false,
            error: "The comment does not found.",
          };
        } else if (foundComment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "Not authorized.",
          };
        } else {
          await client.comment.update({ where: { id }, data: { payload } });

          return {
            ok: true,
          };
        }
      }
    ),
  },
};
