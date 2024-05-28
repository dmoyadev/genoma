<script setup lang="ts" generic="T">
import BaseRadio from '@/components/radio/BaseRadio.vue';
import { hasSlotContent } from '@/utils/helpers.ts';

interface Props {
	options: T[]; /* The options of the radio group */
	hasError?: boolean; /* Indicates if the radio group has an error */
	customValidity?: string; /* The error message of the radio group. It is the default value for the `error` slot */
	loading?: boolean; /* Indicates if the radio group is loading */
	isDisabled?: (option: T) => boolean; /* Indicates if the radio group is disabled */
}
const props = defineProps<Props>();
const modelValue = defineModel<T>();
</script>

<template>
	<div class="radio-group">
		<div
			class="radio-wrapper"
			:class="{
				'has-error': hasError,
			}"
		>
			<!-- @slot The radio inputs -->
			<slot>
				<BaseRadio
					v-for="(option, index) in options"
					:key="index"
					v-model="modelValue"
					v-bind="$attrs"
					:value="option"
					:disabled="('disabled' in $attrs && (!!$attrs.disabled || $attrs.disabled === ''))
						|| loading
						|| (!!props.isDisabled && props.isDisabled(option))"
				>
					<!-- @slot Radio label -->
					<slot
						name="radio-label"
						:option="option"
					>
						{{ option }}
					</slot>
				</BaseRadio>
			</slot>
		</div>

		<!-- Error slot -->
		<p
			v-if="!loading && hasError"
			class="error"
		>
			<!-- @slot Error message of the input. Defaults to the customValidity prop -->
			<slot name="error">
				{{ customValidity }}
			</slot>
		</p>

		<!-- Helper slot -->
		<p
			v-if="hasSlotContent($slots.helper)"
			class="helper"
		>
			<!-- @slot Helper message of the input -->
			<slot name="helper" />
		</p>
	</div>
</template>

<style scoped lang="scss">
.radio-group {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;

	.radio-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;

		&.has-error {
			border-color: var(--color-danger) !important;
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
	}

	.error {
		color: var(--color-danger);
		font-size: var(--font-size-small);
		line-height: var(--font-size-small);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.helper {
		color: var(--color-primary);
		font-size: var(--font-size-small);
		line-height: var(--font-size-small);
		display: flex;
		align-items: center;
		gap: 4px;
	}
}
</style>
