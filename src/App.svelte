<script>
	import { Router } from '@roxi/routify'
	import { routes } from '../.routify/routes'
	import TitleBar from './components/titleBar/TitleBar.svelte'
</script>

<TitleBar />

<Router {routes} />
