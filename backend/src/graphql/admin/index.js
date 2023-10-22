// const AdminResolvers = require('./resolvers')
// const {AdminTypeDefs} = require('./typedefs')
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const {UserInputError,ApolloError,AuthenticationError, ForbiddenError} = require(`apollo-server-express`)

function permissionDirectiveTransformer(schema) {
  return mapSchema(schema, {

    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {

      // Check whether this field has the specified directive
      const permissionDirective = getDirective(schema, fieldConfig, "permission")?.[0]
      //const isQueryDirective = getDirective(schema, fieldConfig, "isQuery")?.[0]
      if (permissionDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, ctx, info) {
            if(!ctx.user) throw new AuthenticationError("User not logged in")
            if(permissionDirective.level === 0) return resolve(source,args,ctx,info)
            const userPerms = global.userPerms.get(ctx.user.discordId)
            if(!userPerms) throw new ForbiddenError("User permission level is 0")
            if((permissionDirective.level > userPerms)) throw new ForbiddenError(`Not enough permissions. User permission level: ${global.userPerms.get(ctx.user.discordId)}. Required permission level: ${permissionDirective.level}`)
            return resolve(source,args,ctx,info)
        }
        return fieldConfig;
      }
    }
  });
}

// module.exports = {AdminResolvers, AdminTypeDefs,permissionDirectiveTransformer}
module.exports = {permissionDirectiveTransformer}