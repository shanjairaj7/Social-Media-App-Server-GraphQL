const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @authenticated on FIELD_DEFINITION
  directive @authorized(role: Role = MEMBER) on FIELD_DEFINITION
  directive @formatDate(format: String = "dd MMM yyyy") on FIELD_DEFINITION

  enum Role {
    MEMBER
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String
    invited: Boolean
    role: Role
  }

  type Post {
    id: ID!
    message: String!
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
    creator: User!
  }

  type SigninOutput {
    id: ID!
    name: String!
    email: String!
    password: String!
    token: String!
    role: Role
    invited: Boolean
  }

  type InvitedUser {
    email: String
    role: Role
  }

  input SignupInput {
    name: String
    email: String
    password: String
  }

  input SigninInput {
    email: String!
    password: String!
  }

  input PostInput {
    message: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  input InviteUserInput {
    email: String
    role: Role
  }

  type Query {
    me: User! @authenticated
    feed: [Post!]!
  }

  type Mutation {
    signup(input: SignupInput!): User!
    signin(input: SigninInput!): SigninOutput!
    createPost(input: PostInput!): Post! @authenticated
    updateMe(input: UpdateUserInput!): User! @authenticated
    invite(input: InviteUserInput!): InvitedUser! @authenticated @authorized(role: ADMIN)
  }

  type Subscription {
    newPost: Post!
  }
`;

module.exports = typeDefs;
