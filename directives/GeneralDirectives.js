const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver, GraphQLString } = require("graphql");
const dfnsFormat = require("date-fns/format");

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    const { format: defaultFormat } = this.args;
    field.args.push({
      type: GraphQLString,
      name: "format",
    });

    field.resolve = (root, { format, ...rest }, context, info) => {
      const result = resolver.call(this, root, rest, context, info);
      return dfnsFormat(result, format || defaultFormat);
    };
  }
}

module.exports = {
  FormatDateDirective,
};
