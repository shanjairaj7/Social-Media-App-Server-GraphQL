const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");

class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    field.resolve = (root, args, context, info) => {
      if (!context.user) {
        throw new Error("Not Authenticated");
      }
      return resolver.call(this, root, args, context, info);
    };
  }
}

class AuthorizedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    const { role: userRole } = this.args;

    field.resolve = (root, args, context, info) => {
      if (userRole !== context.user.role) {
        throw new Error("User not authorized");
      }
      return resolver.call(this, root, args, context, info);
    };
  }
}

module.exports = {
  AuthenticatedDirective,
  AuthorizedDirective,
};
