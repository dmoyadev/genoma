<script setup lang="ts" generic="T">
const modelValue = defineModel<T>();
</script>

<template>
	<label>
		<input
			v-model="modelValue"
			v-bind="$attrs"
			type="radio"
		>

		<span>
			<!-- @slot The label of the radio -->
			<slot />
		</span>
	</label>
</template>

<style scoped lang="scss">
label {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 42px;
	border-radius: 4px;
	color: var(--color-secondary-accent);
	background: var(--color-gray-0-alpha);

	&:has(input:checked) {
		background: var(--color-primary);
		color: var(--color-primary-accent);
	}

	&:has(input:disabled) {
		opacity: .5;
	}
}
</style>
