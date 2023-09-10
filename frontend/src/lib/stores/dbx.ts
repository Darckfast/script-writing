import { load } from '@/functions/loadSave/loadSave'
import { Auth } from '@/functions/wailsjs/go/sync/DBXSync'
import dayjs from 'dayjs'
import { Dropbox, DropboxAuth } from 'dropbox'
import { get, writable } from 'svelte/store'

const clientId = import.meta.env.VITE_DBX_CLIENT_ID

export const dbx = new Dropbox()
export const isFetching = writable(false)

const localStorageKey = 'dbx-access-token'

const { set, subscribe, update } = writable(
  new DropboxAuth({
    clientId
  })
)

const { access_token, refresh_token, expires_in } =
  load<DBXToken>({
    key: localStorageKey,
    defaultValue: {
      access_token: null,
      expires_in: null,
      refresh_token: null
    }
  })

if (access_token) {
  set(
    new DropboxAuth({
      clientId,
      accessToken: access_token,
      refreshToken: refresh_token,
      accessTokenExpiresAt: dayjs(expires_in).toDate()
    })
  )
}

setInterval(() => {
  get(dbxAuth).checkAndRefreshAccessToken()
}, 1000 * 60 * 2)

subscribe((state) => {
  void Auth(state.getAccessToken())
})

const resetToken = () =>
  set(
    new DropboxAuth({
      clientId
    })
  )

export const dbxAuth = {
  set,
  subscribe,
  update,
  resetToken
}
