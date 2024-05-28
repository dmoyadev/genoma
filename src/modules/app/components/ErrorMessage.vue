<template>
	<p>
		<!-- @slot Error message -->
		<slot />
	</p>
</template>

<style scoped lang="scss">
p {
	width: 100%;
	background: var(--color-danger);
	color: var(--color-danger-accent);
	border-radius: 4px;
	padding: 8px;
	animation: shake 0.2s ease-in-out 0s 2;

	@keyframes shake {
		0% {
			margin-left: 0;
		}
		25% {
			margin-left: 0.5rem;
		}
		75% {
			margin-left: -0.5rem;
		}
		100% {
			margin-left: 0;
		}
	}
}
</style>
