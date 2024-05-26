<script setup lang="ts">
interface Props {
	current?: number; /* Indicates the current step in the stepper */
	total?: number; /* Indicates the number of steps in the stepper */
}

withDefaults(defineProps<Props>(),	{
	current: 1,
	total: 1,
});
</script>

<template>
	<nav class="stepper">
		<div
			v-for="n in total"
			:key="n"
			:class="{ active: n <= current }"
		/>
	</nav>
</template>

<style scoped lang="scss">
.stepper {
	display: flex;
	justify-content: center;
	gap: 16px;

	div {
		width: 16px;
		height: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background: var(--color-secondary-accent);
		font-weight: bold;

		&.active {
			border: none;
			animation: pop .5s ease-in-out forwards;

			@keyframes pop {
				0% {
					transform: scale(1);
					background: var(--color-secondary-accent);
				}
				50% {
					transform: scale(1.2);
					background-color: var(--color-primary);
				}
				100% {
					transform: scale(1);
					background-color: var(--color-primary);
				}
			}
		}
	}
}
</style>
