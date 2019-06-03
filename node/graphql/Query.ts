import { buildGraphQLError } from '@gocommerce/utils'
// import { ColossusContext } from 'colossus'
// import { mergeDeep } from './../json_schema/functions'
// const endpointAssets = 'https://s3.amazonaws.com/gc-ui/'

import { Args } from './index'

export const carriers = async (_param: Args, makeApiCall: Function) => {
  const url = `/logistics/carriers`
  const { data, error } = await makeApiCall(url, 'get')
  if (error) {
    throw buildGraphQLError('GET Carriers Faild', error.response.status)
  }
  return { nodes: data, totalNodes: data.length }
}

export const carrier = async (param: Args, makeApiCall: Function) => {
  const url = `/logistics/carriers/${param.id}`
  const { data, error } = await makeApiCall(url, 'get')

  if (error) {
    throw buildGraphQLError('GET Carrier Faild:' + param.id, error.response.status)
  }

  return data
}
