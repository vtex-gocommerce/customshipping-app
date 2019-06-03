import FormData from 'form-data'

import { Args, Context } from './index'

export const deleteCarrier = async (param: Args, makeApiCall: Function) => {
  const errorList: string[] = []
  for (let id of param.id) {
    const url = `/logistics/carriers/${id}`
    const { error } = await makeApiCall(url, 'delete', { id })
    if (error) {
      errorList.push(id)
    }
  }
  return { status: 'finished', status_code: 200, message: errorList }
}

export const saveCarrier = async (param: Args, makeApiCall: Function, _ctx: Context) => {
  const paramJSON = JSON.parse(param.data)
  const url = `/logistics/carriers/${paramJSON.id}`
  let { error: SaveCarryError } = await makeApiCall(url, 'put', paramJSON)
  const errorList = []

  if (param.file) {
    const { filename, mimetype, stream } = await param.file

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

    let responseUpload = await makeApiCall(freightsUrl, 'post', formData, {
      ...formData.getHeaders()
    })

    let { error: errorSaveCarrier } = responseUpload

    if (SaveCarryError || errorSaveCarrier) {
      const error = SaveCarryError || errorSaveCarrier
      if (error.data && error.data.message) {
        errorList.push({ message: error.data.message, code: error.status })
      } else {
        errorList.push({ message: error.data, code: error.status })
      }
    }
  }

  return { status: 'success', userErrors: errorList }
}
