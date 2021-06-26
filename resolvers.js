const { PubSub } = require("apollo-server");
const { hashPassword, generateToken, comparePassword } = require("./helpers/auth");
const User = require("./models/User");
const {
  signupInputValidation,
  signinInputValidation,
  postInputValidation,
  inviteUserInputValidation,
} = require("./validation");

const pubSub = new PubSub();
const NEW_POST = "NEW_POST";

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      const user = await context.models.User.findOne({ _id: context.user.id });
      return user;
    },
    feed: async (_, __, context) => {
      const posts = await context.models.Post.find();
      return posts;
    },
  },
  Mutation: {
    signup: async (_, { input }, context) => {
      await signupInputValidation(input);

      try {
        const users = await context.models.User.find({ email: input.email });
        if (users.length !== 0) {
          throw new Error("User already exists");
        }
      } catch (error) {
        throw new Error(error);
      }

      const invitedUser = await context.models.Invite.findOne({
        email: input.email,
      });

      const hashedPassword = await hashPassword(input.password);
      const newUser = new User({
        ...input,
        password: hashedPassword,
        invited: invitedUser ? true : false,
        role: invitedUser && invitedUser.role,
      });
      try {
        const user = await newUser.save();
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },

    signin: async (_, { input }, context) => {
      await signinInputValidation(input);

      const user = await context.models.User.findOne({ email: input.email });
      if (!user) {
        throw new Error("There is no account with this email");
      }

      const isSamePassword = await comparePassword(input.password, user.password);
      if (!isSamePassword) {
        throw new Error("Password does not match");
      }

      const jwt = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      const response = {
        ...user._doc,
        id: user._doc._id,
        token: jwt,
      };
      return response;
    },
    createPost: async (_, { input }, context) => {
      await postInputValidation(input);

      const newPost = new context.models.Post({
        ...input,
        creator: context.user.id,
      });
      const post = await newPost.save();

      pubSub.publish(NEW_POST, {
        newPost: post,
      });

      return post;
    },
    updateMe: async (_, { input }, context) => {
      const user = await context.models.User.findOneAndUpdate(
        {
          _id: context.user.id,
        },
        input,
        { new: true }
      );
      return user;
    },
    invite: async (_, { input }, context) => {
      await inviteUserInputValidation(input);

      const invites = await context.models.Invite.find({ email: input.email });
      if (invites.length !== 0) {
        throw new Error("User is already invited");
      }

      const newInvite = new context.models.Invite(input);
      const invite = await newInvite.save();

      return invite;
    },
  },
  Subscription: {
    newPost: {
      subscribe: () => pubSub.asyncIterator(NEW_POST),
    },
  },
  User: {
    password() {
      return null;
    },
  },
  Post: {
    creator: async (post, __, context) => {
      const creator = await User.findOne({ _id: post.creator });
      return creator;
    },
  },
};

module.exports = resolvers;
