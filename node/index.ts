import { Service } from '@vtex/api'

import { resolvers } from './graphql/index'

export default new Service({
  graphql: {
    resolvers,
  },
})