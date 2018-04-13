import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import UserType from '../types/UserType'

const signupMutation = mutationWithClientMutationId({
  name: 'SignUp',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: UserType,
    },
  },
  async mutateAndGetPayload() {
    return {
      user: {
        email: 'emjaksa@gmail.com',
      },
    }
  },
})

export default signupMutation
