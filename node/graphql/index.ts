import { loggerMiddleware } from '@gocommerce/utils'
import { carriers, carrier } from './Query'
import { deleteCarrier, saveCarrier } from './Mutation'

const splunkToken = 'dd433cc0-9106-4b0d-883a-377d57e8eb1a'

export interface Info { [key: string]: any }
export interface Context { [key: string]: any }
export interface Args { [key: string]: any }

export const resolvers = loggerMiddleware(splunkToken, {
  Query: {
    carriers: async (_: any, param: Args, _ctx: Context, _info: Info, makeApiCall: Function) => await carriers(param, makeApiCall),
    carrier: async (_: any, param: Args, _ctx: Context, _info: Info, makeApiCall: Function) => await carrier(param, makeApiCall)
  },
  Mutation: {
    deleteCarrier: async (_: any, param: Args, _ctx: Context, _info: Info, makeApiCall: Function) => await deleteCarrier(param, makeApiCall),
    saveCarrier: async (_: any, param: Args, ctx: Context, _info: Info, makeApiCall: Function) => await saveCarrier(param, makeApiCall, ctx)
  }
})
