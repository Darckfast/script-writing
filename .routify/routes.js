
/**
 * @roxi/routify 2.18.8
 * File generated Sat Dec 03 2022 17:36:36 GMT-0300 (Brasilia Standard Time)
 */

export const __version = "2.18.8"
export const __timestamp = "2022-12-03T20:36:36.624Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
  "name": "_layout",
  "filepath": "/_layout.svelte",
  "root": true,
  "ownMeta": {},
  "absolutePath": "/home/costa/Documents/writing-vite/src/pages/_layout.svelte",
  "children": [
    {
      "isFile": true,
      "isDir": false,
      "file": "index.svelte",
      "filepath": "/index.svelte",
      "name": "index",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/home/costa/Documents/writing-vite/src/pages/index.svelte",
      "importPath": "../src/pages/index.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": true,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/index",
      "id": "_index",
      "component": () => import('../src/pages/index.svelte').then(m => m.default)
    },
    {
      "isFile": false,
      "isDir": true,
      "file": "story",
      "filepath": "/story",
      "name": "story",
      "ext": "",
      "badExt": false,
      "absolutePath": "/home/costa/Documents/writing-vite/src/pages/story",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "[storyId].svelte",
          "filepath": "/story/[storyId].svelte",
          "name": "[storyId]",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/home/costa/Documents/writing-vite/src/pages/story/[storyId].svelte",
          "importPath": "../src/pages/story/[storyId].svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/story/:storyId",
          "id": "_story__storyId",
          "component": () => import('../src/pages/story/[storyId].svelte').then(m => m.default)
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/story"
    }
  ],
  "isLayout": true,
  "isReset": false,
  "isIndex": false,
  "isFallback": false,
  "isPage": false,
  "isFile": true,
  "file": "_layout.svelte",
  "ext": "svelte",
  "badExt": false,
  "importPath": "../src/pages/_layout.svelte",
  "meta": {
    "recursive": true,
    "preload": false,
    "prerender": true
  },
  "path": "/",
  "id": "__layout",
  "component": () => import('../src/pages/_layout.svelte').then(m => m.default)
}


export const {tree, routes} = buildClientTree(_tree)

