<script>
	export let value = ''
</script>

<label>
	<input bind:value class="input-field" />
</label>

<style lang="scss">
	label {
		width: 80%;
	}

	.input-field {
		@import '../styles/variables.scss';

		height: 5rem;
		width: 100%;
		outline: unset;
		border: none;
		transition: all 0.2s;
		color: $text;

		padding: 1rem;

		border-radius: 8px;
		background-color: lighten($background, 30%);
	}
</style>
