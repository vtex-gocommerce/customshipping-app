import { biuldGraphQlError } from '@gocommerce/utils'
// import { ColossusContext } from 'colossus'
// import { mergeDeep } from './../json_schema/functions'
// const endpointAssets = 'https://s3.amazonaws.com/gc-ui/'

export const carriers = async (param, makeApiCall) => {
  const url = param.type == 'correios' ? `/logistics/externalcarriers` : `/logistics/carriers`
  const { data, error } = await makeApiCall(url, 'get')
  if (error) {
    throw biuldGraphQlError('GET Carriers Faild', error.response.status)
  }
  return { nodes: data, totalNodes: data.length }
}

export const carrier = async (param, makeApiCall) => {
  const url = `/logistics/${param.type}/${param.id}`
  const { data, error } = await makeApiCall(url, 'get')

  if (error) {
    throw biuldGraphQlError('GET Carrier Faild:' + param.id, error.response.status)
  }

  return data
}
