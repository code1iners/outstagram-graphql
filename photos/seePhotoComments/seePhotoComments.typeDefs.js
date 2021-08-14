import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seePhotoComments(id: Int!, lastCommentId: Int): [Comment]
  }
`;
