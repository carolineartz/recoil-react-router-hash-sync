import queryString from 'query-string'

export const parseSearch = () => {
  const search = window.document.location.href.split('?')[1]
  return queryString.parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'none'
  })
}

export const stringifyParams = (params: any) => {
  return queryString.stringify(params, {
    arrayFormat: 'none',
    skipEmptyString: true,
    skipNull: true
  })
}
