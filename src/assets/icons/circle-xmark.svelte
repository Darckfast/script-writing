<script>
	export let classes = ''
</script>

<svg class={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
	<!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
	<path
		d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
	/>
</svg>

<style lang="scss">
	@import '../../styles/variables.scss';

	svg {
		vertical-align: middle;
		cursor: pointer;

		width: 1.2rem;
		transition: all 0.2s;

		border-radius: 50%;
		background-color: #fff;
		border: 1px solid #fff;

		path {
			fill: $error;
		}

		&:hover {
			path {
				fill: lighten($error, 10%);
			}

			transform: scale(1.1);
		}

		&.confirm {
			fill: $warn;
		}
	}
</style>
