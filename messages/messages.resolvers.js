import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }, { lastMessageId }) =>
      client.message.findMany({
        where: { roomId: id },
        take: 10,
        skip: lastMessageId ? 1 : 0,
        ...(lastMessageId && { cursor: { id: lastMessageId } }),
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: { id: { not: loggedInUser.id } },
        },
      });
    },
  },
};
