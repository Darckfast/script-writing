<main
	class="flex items-center justify-center flex-wrap w-full h-full bg-slate-900"
>
	<slot />
</main>
<footer>
	<span class="absolute bottom-1 right-1 text-xs text-slate-200"
		>{import.meta.env.VITE_VERSION}</span
	>
</footer>
