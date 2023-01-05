<script>
	import { Router } from '@roxi/routify'
	import { routes } from '../.routify/routes'
	import GlobalError from './components/error/GlobalError.svelte'
	import TitleBar from './components/titleBar/TitleBar.svelte'
</script>

<TitleBar />

<GlobalError />

<Router {routes} />
