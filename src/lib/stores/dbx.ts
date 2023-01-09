import dayjs from 'dayjs'
import { Dropbox, DropboxAuth } from 'dropbox'
import { writable } from 'svelte/store'
import { load, save } from '../loadSave'
import { globalError } from './globalError'

const clientId = import.meta.env.VITE_DBX_CLIENT_ID

export const dbx = writable(new Dropbox())
export const isFetching = writable(false)

const createDbxAuth = () => {
	const { set, subscribe, update } = writable(
		new DropboxAuth({
			clientId
		})
	)

	const { access_token, refresh_token, expires_in } = load<any>({
		key: 'dbx-access_token',
		defaultValue: {}
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

	subscribe((state) => {
		state.checkAndRefreshAccessToken()

		dbx.set(new Dropbox({ auth: state }))
	})

	const setToken = (accessCode: string) => {
		isFetching.set(true)

		update((state) => {
			state.setCodeVerifier(localStorage.getItem('codeVerifier'))
			state
				.getAccessTokenFromCode(undefined, accessCode)
				.then(
					({ result: { access_token, refresh_token, expires_in } }: any) => {
						save({
							key: 'dbx-access_token',
							value: {
								access_token,
								refresh_token,
								expires_in: dayjs().add(expires_in, 'second').unix()
							}
						})

						state.setAccessToken(access_token)
						state.setRefreshToken(refresh_token)
						state.setAccessTokenExpiresAt(
							dayjs().add(expires_in, 'second').toDate()
						)

						set(state)
					}
				)
				.catch((err) => globalError.pushError(err))
				.finally(() => {
					isFetching.set(false)
				})

			return state
		})
	}

	const resetToken = () =>
		set(
			new DropboxAuth({
				clientId
			})
		)

	return {
		set,
		subscribe,
		update,
		setToken,
		resetToken
	}
}

export const dbxAuth = createDbxAuth()
