import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import signupMutation from './mutations/signupMutation'
import UserType from './types/UserType'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      user: {
        type: UserType,
        args: {
          email: {
            name: 'email',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: () => ({
          email: 'emjaksa@gmail.com',
        }),
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      signup: signupMutation,
    },
  }),
})
