import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";
export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, username, email, password: newPassword, bio },
        { loggedInUser, protectResolver }
      ) => {
        protectResolver(loggedInUser);

        let hashedPassword = null;
        if (newPassword) {
          hashedPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(hashedPassword && { password: hashedPassword }),
          },
        });
        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update profile.",
          };
        }
      }
    ),
  },
};
