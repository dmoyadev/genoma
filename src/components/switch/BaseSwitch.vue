<script setup lang="ts" generic="T">
const modelValue = defineModel<T>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);
</script>

<template>
	<label>
		<!-- @slot The label of the switch -->
		<slot />

		<input
			v-bind="$attrs"
			:id="($attrs.id as string) || _componentUID"
			v-model="modelValue"
			type="checkbox"
		>
	</label>
</template>

<style scoped lang="scss">
label {
	--switch-height: 34px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	position: relative;
	height: var(--switch-height);

	input {
		--border-size: 1px;
		flex-shrink: 0;
		height: 100%;
		width: 54px;
		border: var(--border-size) solid var(--color-secondary-accent);
		border-radius: 50px;
		position: relative;

		&:disabled {
			opacity: .5;
		}

		&:before {
			--switch-toggle-height: 24px;
			content: '';
			position: absolute;
			--free-space: calc(var(--switch-height) - var(--switch-toggle-height) - calc(var(--border-size) * 2));
			top: calc(var(--free-space) / 2);
			left: calc(var(--free-space) / 2);
			width: var(--switch-toggle-height);
			height: var(--switch-toggle-height);
			border-radius: 100%;
			transition: all .3s;
			border: var(--border-size) solid var(--color-secondary-accent);
		}

		&:checked {
			&:before {
				border: none;
				background: var(--color-success);
				transform: translateX(20px);
			}
		}
	}
}
</style>
