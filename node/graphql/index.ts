import { loggerMiddleware } from '@gocommerce/utils'
import { carriers, carrier } from './Query'
import { deleteCarrier, saveCarrier } from './Mutation'

const splunkToken = 'dd433cc0-9106-4b0d-883a-377d57e8eb1a'

export const resolvers = loggerMiddleware(splunkToken, {
  Query: {
    carriers: async (_, param, ctx, info, makeApiCall) => await carriers(param, makeApiCall),
    carrier: async (_, param, ctx, info, makeApiCall) => await carrier(param, makeApiCall)
  },
  Mutation: {
    deleteCarrier: async (_, param, ctx, info, makeApiCall) => await deleteCarrier(param, makeApiCall),
    saveCarrier: async (_, param, ctx, info, makeApiCall) => await saveCarrier(param, makeApiCall, ctx)
  }
})
