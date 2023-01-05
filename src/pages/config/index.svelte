<script lang="ts">
	import { url } from '@roxi/routify'
	import ArrowLeft from '../../styles/icons/arrow-left.svelte'

	import { onMount } from 'svelte'
	import { dbxAuth, isFetching } from '../../lib/stores/dbx'
	import Check from '../../styles/icons/check.svelte'
	import DropboxIcon from '../../styles/icons/dropbox-icon.svelte'

	import { readText } from '@tauri-apps/api/clipboard'
	import { globalError } from '../../lib/stores/globalError'
	import Spinner from '../../styles/icons/spinner.svelte'

	let dbxUrl = ''
	let accessCode = ''

	onMount(() => {
		if ($dbxAuth.getAccessToken()) return

		$dbxAuth
			.getAuthenticationUrl(
				undefined,
				undefined,
				'code',
				'offline',
				undefined,
				undefined,
				true
			)
			.then((authUrl) => {
				localStorage.setItem('codeVerifier', $dbxAuth.getCodeVerifier())
				dbxUrl = authUrl.toString()
			})
			.catch((err) => globalError.pushError(err))
	})

	const pasteCode = async () => {
		accessCode = await readText()
		saveSession()
	}

	const saveSession = () => {
		dbxAuth.setToken(accessCode)
	}
</script>

<div class="w-full h-full">
	<header class="flex justify-between items-center w-full gap-2 px-2">
		<a href={$url('../../..')} class="btn btn-primary">
			<ArrowLeft /> go back</a
		>
		<h1>Configurations</h1>
	</header>

	<div class="flex flex-wrap items-center justify-center gap-2">
		<div class="flex gap-2 items-center">
			<a
				class="btn btn-primary gap-2"
				class:btn-disabled={$dbxAuth.getAccessToken()}
				title={$dbxAuth.getAccessToken()
					? 'already authenticated'
					: 'click to authenticate'}
				target="_blank"
				rel="noreferrer"
				href={dbxUrl}><DropboxIcon /> oauth</a
			>
			{#if !$dbxAuth.getAccessToken()}
				<label class="input-group w-auto">
					<input
						bind:value={accessCode}
						on:change={saveSession}
						placeholder="paste the token here"
						class="input input-primary"
					/>
					<button class="btn btn-primary" on:click={pasteCode}
						>{#if $isFetching}
							<Spinner />
						{:else}
							+ paste
						{/if}</button
					>
				</label>
			{:else}
				<em class="text-green-500">
					<Check />
				</em>

				<span
					>Expires at {Intl.DateTimeFormat('en', {
						dateStyle: 'short',
						timeStyle: 'short',
						timeZone: 'America/Sao_Paulo'
					}).format($dbxAuth.getAccessTokenExpiresAt())}</span
				>
			{/if}
		</div>
	</div>
</div>
