import { buildGraphQLError } from '@gocommerce/utils'
import FormData from 'form-data'

import { Args, Context } from './index'

export const deleteCarrier = async (param: Args, makeApiCall: Function) => {
  const errorList: string[] = []
  for (let id of param.id) {
    const url = `/logistics/carriers/${id}`
    const { error } = await makeApiCall(url, 'delete', { id })

    if (error) throw buildGraphQLError('', error.status)
  }
  
  return { status: 'finished', status_code: 200, message: errorList }
}

// const supportedMimetypes = ['application/vnd.ms-excel']
const supportedExtensions = ['xls']
export const saveCarrier = async (param: Args, makeApiCall: Function, _ctx: Context) => {
  const errorList: any[] = []
  const paramJSON = JSON.parse(param.data)

  const url = `/logistics/carriers/${paramJSON.id}`

  const { error: saveCarryError } = await makeApiCall(url, 'put', paramJSON)

  if (saveCarryError) throw buildGraphQLError('', saveCarryError.status)

  if (param.file) {
    const { filename, mimetype, createReadStream } = await param.file
    const stream = createReadStream()
    const fileExtension = filename.split('.')[1]

    if (!supportedExtensions.includes(fileExtension)) {
      throw buildGraphQLError('customshipping-app.invalid-file-extension', '500')
    }

    const buffer = (await new Promise((resolve, reject) => {
      const bufs: any[] = []
      stream.on('data', (d: any) => bufs.push(d))
      stream.on('end', () => {
        resolve(Buffer.concat(bufs))
      })
      stream.on('error', reject)
    })) as Buffer

    const formData = new FormData()
    formData.append('file', buffer, {
      filename,
      contentType: mimetype,
      knownLength: buffer.byteLength
    })

    const freightsUrl = `/logistics/carriers/${paramJSON.id}/freights`

    const { error: errorSaveCarrier } = await makeApiCall(freightsUrl, 'post', formData, {
      ...formData.getHeaders()
    })

    if (errorSaveCarrier) throw buildGraphQLError('', errorSaveCarrier.status)
  }

  return { status: 'success', userErrors: errorList }
}
