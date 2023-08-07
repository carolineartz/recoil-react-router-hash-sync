// @ts-nocheck
import {
  ListenInterface,
  WriteInterface,
  ItemKey,
  ItemSnapshot,
  ReadItem,
  StoreKey,
  SyncEffectOptions,
  syncEffect,
  RecoilSync,
  RecoilSyncOptions,
  URLSyncEffectOptions
} from 'recoil-sync'
import queryString from 'query-string'
import { assertion, writableDict, mixed, CheckerReturnType } from '@recoiljs/refine'

import { DefaultValue, AtomEffect, RecoilLoadable } from 'recoil'
import { useCallback, useEffect, useMemo, useRef, ReactNode } from 'react'

// const err = require('recoil-shared/util/Recoil_err')

type NodeKey = string

type ItemState = CheckerReturnType<typeof itemStateChecker>
type AtomRegistration = {
  history: HistoryOption
  itemKeys: Set<ItemKey>
}

const registries: Map<StoreKey, Map<NodeKey, AtomRegistration>> = new Map()

const getParsedSearch = (search: string) => {
  return queryString.parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'none'
  })
}

const itemStateChecker = writableDict(mixed())
const refineState = assertion(itemStateChecker)
const wrapState = (x: any): ItemSnapshot => {
  return new Map(Array.from(Object.entries(refineState(x))))
}
const unwrapState = (state: ItemSnapshot): ItemState =>
  Object.fromEntries(
    Array.from(state.entries())
      // Only serialize atoms in a non-default value state.
      .filter(([, value]) => !(value instanceof DefaultValue))
  )

function parseURL(href: string, loc: LocationOption, deserialize: (string: string) => any): ItemSnapshot {
  const url = new URL(href)
  console.log('paring url', url)
  switch (loc.part) {
    case 'href':
      return wrapState(deserialize(`${url.pathname}${url.search}${url.hash}`))
    case 'hash':
      return url.hash ? wrapState(deserialize(decodeURIComponent(url.hash.substring(1)))) : null
    case 'search':
      return url.search ? wrapState(deserialize(decodeURIComponent(url.search.substring(1)))) : null
    case 'queryParams': {
      const search = '?' + url.hash.split('?')[1]
      console.log('parseURL queryParams', search)

      // const searchParams = new URLSearchParams(search)
      const parsedSearchParams = getParsedSearch(search)

      const { param } = loc

      if (param != null) {
        console.log('param', param)
        // const stateStr = searchParams.get(param)
        const stateStr = parsedSearchParams[param]
        return stateStr != null ? wrapState(deserialize(stateStr)) : new Map()
      }

      return new Map(
        Array.from(Object.entries(parsedSearchParams)).map(([key, value]) => {
          console.log('key, value', key, value)
          try {
            return [key, deserialize(value)]
          } catch (error) {
            return [key, RecoilLoadable.error(error)]
          }
        })
      )
    }
  }
  // throw err(`Unknown URL location part: "${loc.part}"`);
}

function encodeURL(href: string, loc: LocationOption, items: ItemSnapshot, serialize: (props: any) => string): string {
  const url = new URL(href)
  console.log('encodeURL', url)
  switch (loc.part) {
    case 'href':
      return serialize(unwrapState(items))
    case 'hash':
      url.hash = encodeURIComponent(serialize(unwrapState(items)))
      break
    case 'search':
      url.search = encodeURIComponent(serialize(unwrapState(items)))
      break
    case 'queryParams': {
      const { param } = loc
      const [pathname, queryParams] = url.hash.split('?')
      // const searchParams = new URLSearchParams(url.search)
      // const searchParams = new URLSearchParams('?' + queryParams)
      const parsedSearchParams = getParsedSearch('?' + queryParams)
      if (param != null) {
        console.log('encodeURL param', param)
        searchParams.set(param, serialize(unwrapState(items)))
      } else {
        console.log('encodeURL items', items)
        for (const [itemKey, value] of items.entries()) {
          // value instanceof DefaultValue ? searchParams.delete(itemKey) : searchParams.set(itemKey, serialize(value))
          console.log('encodeURL itemKey, value', itemKey, value)
          if (value instanceof DefaultValue) {
            console.log('encodeURL', 'deleting', itemKey)
            delete parsedSearchParams[itemKey]
          } else {
            console.log('encodeURL', 'setting', itemKey, serialize(value))
            parsedSearchParams[itemKey] = value
          }
        }
      }
      const pathWithHash =
        pathname +
        '?' +
        queryString.stringify(parsedSearchParams, {
          arrayFormat: 'none',
          skipEmptyString: true,
          skipNull: true
        })
      console.log('setting hash', pathWithHash)
      // console.log('setting hash', pathname + '?' + searchParams.toString())
      url.hash = pathWithHash
      break
    }
    default:
      throw err(`Unknown URL location part: "${loc}"`)
  }
  console.log('returning href', url.href)
  return url.href
}

///////////////////////
// useRecoilURLSync()
///////////////////////
export type LocationOption =
  | { part: 'href' }
  | { part: 'hash' }
  | { part: 'search' }
  | { part: 'queryParams'; param?: string }
export type BrowserInterface = {
  replaceURL?: (url: string) => void
  pushURL?: (url: string) => void
  getURL?: () => string
  listenChangeURL?: (handler: () => void) => () => void
}
export type RecoilURLSyncOptions = {
  children: ReactNode
  storeKey?: StoreKey
  location: LocationOption
  serialize: (arg: any) => string
  deserialize: (arg: string) => any
  browserInterface?: BrowserInterface
}

const DEFAULT_BROWSER_INTERFACE = {
  replaceURL: (url: string) => window.history.replaceState(null, '', url),
  pushURL: (url: string) => window.history.pushState(null, '', url),
  getURL: () => window.document.location,
  listenChangeURL: (handleUpdate: () => void) => {
    window.addEventListener('popstate', handleUpdate)
    return () => window.removeEventListener('popstate', handleUpdate)
  }
}

export function RecoilURLHashParamsSync({
  storeKey,
  location: loc,
  serialize,
  deserialize,
  browserInterface,
  children
}: RecoilURLSyncOptions) {
  const { getURL, replaceURL, pushURL, listenChangeURL } = {
    ...DEFAULT_BROWSER_INTERFACE,
    ...(browserInterface ?? {})
  }

  // Parse and cache the current state from the URL
  // Update cached URL parsing if properties of location prop change, but not
  // based on just the object reference itself.
  const memoizedLoc = useMemo(
    () => loc,
    // Complications with disjoint uniont
    // $FlowIssue[prop-missing]
    // // eslint-disable-line fb-www/react-hooks-deps
    [loc.part, loc.queryParam]
  )
  const updateCachedState: () => void = useCallback(() => {
    cachedState.current = parseURL(getURL(), memoizedLoc, deserialize)
  }, [getURL, memoizedLoc, deserialize])
  const cachedState = useRef(null)

  // Avoid executing updateCachedState() on each render
  const firstRender = useRef(true)
  firstRender.current && updateCachedState()
  firstRender.current = false
  useEffect(updateCachedState, [updateCachedState])

  const write = useCallback(
    ({ diff, allItems }: WriteInterface) => {
      updateCachedState() // Just to be safe...
      console.log('write')
      // This could be optimized with an itemKey-based registery if necessary to avoid
      // atom traversal.
      const atomRegistry = registries.get(storeKey)
      console.log('atomRegistry', atomRegistry)
      const itemsToPush =
        atomRegistry != null
          ? new Set(
              Array.from(atomRegistry)
                .filter(
                  ([, { history, itemKeys }]) => history === 'push' && Array.from(itemKeys).some(key => diff.has(key))
                )
                .map(([, { itemKeys }]) => itemKeys)
                .reduce(
                  // $FlowFixMe[missing-local-annot]
                  (itemKeys, keys) => itemKeys.concat(Array.from(keys)),
                  []
                )
            )
          : null
      console.log('itemsToPush', itemsToPush)

      if (itemsToPush?.size && cachedState.current != null) {
        const replaceItems: ItemSnapshot = cachedState.current
        // First, repalce the URL with any atoms that replace the URL history
        for (const [key, value] of allItems) {
          console.log('should be setting', key, value)
          if (!itemsToPush.has(key)) {
            replaceItems.set(key, value)
          }
        }
        console.log('---> replacing with', encodeURL(getURL(), loc, replaceItems, serialize))
        const urlForReplace = encodeURL(getURL(), loc, replaceItems, serialize)

        console.log('urlForReplace', urlForReplace.split('/#')[1])

        replaceURL(urlForReplace.split('/#')[1])

        console.log('---> pushing with', encodeURL(getURL(), loc, allItems, serialize))
        const urlForPush = encodeURL(getURL(), loc, allItems, serialize)
        console.log('urlForPush', urlForPush.split('/#')[1])
        // Next, push the URL with any atoms that caused a new URL history entry
        pushURL(urlForPush.split('/#')[1])
      } else {
        console.log('---> replacing with', encodeURL(getURL(), loc, allItems, serialize))
        // Just replace the URL with the new state
        const urlForReplace = encodeURL(getURL(), loc, allItems, serialize)
        console.log('urlForReplace', urlForReplace.split('/#')[1])
        replaceURL(urlForReplace.split('/#')[1])
      }
      cachedState.current = allItems
    },
    [getURL, loc, pushURL, replaceURL, serialize, storeKey, updateCachedState]
  )

  const read: ReadItem = useCallback((itemKey: ItemKey) => {
    return cachedState.current?.has(itemKey) ? cachedState.current?.get(itemKey) : new DefaultValue()
  }, [])

  const listen = useCallback(
    ({ updateAllKnownItems }: ListenInterface) => {
      console.log('LISTEN')
      function handleUpdate() {
        console.log('~~~~~~~~~~~~~~~~~~~handleUpdate')
        updateCachedState()
        if (cachedState.current != null) {
          updateAllKnownItems(cachedState.current)
        }
      }
      return listenChangeURL(handleUpdate)
    },
    [listenChangeURL, updateCachedState]
  )

  return (
    <RecoilSync storeKey={storeKey} read={read} write={write} listen={listen}>
      {children}
    </RecoilSync>
  )

  // useRecoilSync({storeKey, read, write, listen});

  // return children;
}

///////////////////////
// urlSyncEffect()
///////////////////////
type HistoryOption = 'push' | 'replace'

export function urlSyncEffect<T>({
  history = 'replace',
  ...options
}: URLSyncEffectOptions & { history: 'push' | 'replace' }): AtomEffect<T> {
  const atomEffect = syncEffect<T>(options)
  return (effectArgs: { node: { key: string } }) => {
    // Register URL sync options
    if (!registries.has(options.storeKey)) {
      registries.set(options.storeKey, new Map())
    }
    const atomRegistry = registries.get(options.storeKey)
    if (atomRegistry == null) {
      throw err('Error with atom registration')
    }
    atomRegistry.set(effectArgs.node.key, {
      history,
      itemKeys: new Set([options.itemKey ?? effectArgs.node.key])
    })

    // Wrap syncEffect() atom effect
    // @ts-ignore
    const cleanup = atomEffect(effectArgs)

    // Cleanup atom option registration
    return () => {
      atomRegistry.delete(effectArgs.node.key)
      cleanup?.()
    }
  }
}
