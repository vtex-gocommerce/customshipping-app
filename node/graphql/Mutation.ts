import { biuldGraphQlError } from '@gocommerce/utils'
import FormData from 'form-data'

export const deleteCarrier = async (param, makeApiCall) => {
  const errorList = []
  for (let id of param.id) {
    const url = `/logistics/carriers/${id}`
    const { data, error } = await makeApiCall(url, 'delete', { id })
    if (error) {
      errorList.push(id)
    }
  }
  return { status: 'finished', status_code: 200, message: errorList }
}

export const saveCarrier = async (param, makeApiCall, ctx) => {
  const paramJSON = JSON.parse(param.data)
  const url = `/logistics/carriers/${paramJSON.id}`
  let { data: responseSaveCarrier, error: SaveCarryError } = await makeApiCall(url, 'put', paramJSON)
  const errorList = []

  if (param.file) {
    const { filename, mimetype, encoding, stream } = await param.file

    const buffer = (await new Promise((resolve, reject) => {
      const bufs = []
      stream.on('data', d => bufs.push(d))
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

    let { data: responseSaveCarrier, error: errorSaveCarrier } = responseUpload

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
