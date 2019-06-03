import * as axios from 'axios'
import { ConfigObjectToQueryString, Sort } from './types'

export abstract class Operation {
  type: string = formatActionName(this.constructor.name)
}

export function assign<T>(state: T, patch: Partial<T>): T {
  return Object.assign({}, state, patch)
}

const formatActionName = (inputString: string) => {
  let formatedActionName: string = ''
  for (var i = 0; i < inputString.length; i++) {
    if (inputString[i].match(/[A-Z]/) != null) {
      formatedActionName = formatedActionName + '_'
    }
    formatedActionName = formatedActionName + inputString[i]
  }
  return formatedActionName.toUpperCase()
}

export function objectToQueryString(source: object, config: ConfigObjectToQueryString[]): string {
  const fields: string[] = config
    .filter((item: ConfigObjectToQueryString): Boolean => !!source[item.field])
    .map((item: ConfigObjectToQueryString) => {
      const queryName: string = encodeURIComponent(item.nameInUrl ? item.nameInUrl : item.field)
      const queryValue: string = encodeURIComponent(item.format ? item.format(source[item.field]) : source[item.field])
      return `${queryName}=${queryValue || item.default}`
    })

  return fields.join('&')
}

export function parseSortString(sort: string): string {
  if (!sort) {
    return ''
  }
  const sortValues: any = sort.split('|')

  return sortValues.join(' ')
}

export function parseActiveSidebarFilterOptions(query, sidebarFilterConfig) {
  let filters = sidebarFilterConfig.reduce((prev, element) => {
    if (!Object.keys(query).includes(element.nameInUrl)) return [...prev]

    let option = element.queryStringToEnabledOption(query[element.nameInUrl], element.options)

    return [...prev, ...option]
  }, [])

  return filters
}

export function getSidebarFilterByOptionCode(optionCode: string, sidebarFilterConfig: any[] = []) {
  return sidebarFilterConfig.find(filter => filter.code === optionCode.split('-')[0])
}

export function getColorByStatus(status: string): string {
  switch (status) {
    case 'processing':
      return 'warning'

    case 'draft':
      return 'on-base-2'

    case 'canceled':
      return 'danger'

    default:
      return 'success'
  }
}

// export interface TranslateValues {
// 	[key: string]: string | number
// }

// export interface Intl {
// 	formatMessage({ id: string }, values?: TranslateValues)
// }
