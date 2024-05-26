<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { InputForm, InputType } from '@/components/input/BaseInput.types.ts';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import { hasSlotContent } from '@/utils/helpers.ts';

interface Props {
	inputType?: InputType; /* The type of the input. @defaults InputForm.BLOCK */
	form?: InputForm; /* The form of the input. @defaults InputForm.TEXT */
	hasError?: boolean; /* Indicates if the input has an error. Determines if the `error` slot will be shown */
	customValidity?: string; /* The error message of the input */
	loading?: boolean; /* Indicates if the input is loading */
	isClearable?: boolean; /* Indicates if the input is clearable. @defaults true */
}

const props = withDefaults(defineProps<Props>(),	{
	form: InputForm.BLOCK,
	inputType: InputType.TEXT,
	isClearable: true,
});

const modelValue = defineModel<string | number>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const showPassword = ref(false);

const $input = ref<HTMLInputElement>();
watch(() => props.hasError, (value) => {
	if (!$input.value) {
		return;
	}

	$input.value.setCustomValidity((value && props.customValidity) ? props.customValidity : '');
});
</script>

<template>
	<div>
		<label>
			<span
				class="input-wrapper"
				:class="{
					[`input-form-${form}`]: true,
					'has-value': !!modelValue,
					'has-error': hasError,
				}"
			>
				<!-- Actual input -->
				<input
					v-if="inputType !== InputType.TEXTAREA"
					:id="($attrs.id as string) || _componentUID"
					ref="$input"
					v-model="modelValue"
					step="any"
					v-bind="$attrs"
					:type="(showPassword ? InputType.TEXT : inputType)"
					:readonly="!!(('readonly' in $attrs && (!!$attrs.readonly || $attrs.readonly === '')) || loading)"
					:disabled="!!(('disabled' in $attrs && (!!$attrs.disabled || $attrs.disabled === '')) || loading)"
					aria-label=""
					@input="modelValue = ($event.target as HTMLInputElement).value"
				>

				<textarea
					v-else
					:id="($attrs.id as string) || _componentUID"
					v-model="modelValue"
					v-bind="$attrs"
					:readonly="!!(('readonly' in $attrs && (!!$attrs.readonly || $attrs.readonly === '')) || loading)"
					:disabled="!!(('disabled' in $attrs && (!!$attrs.disabled || $attrs.disabled === '')) || loading)"
					aria-label=""
				/>

				<!-- Icon right -->
				<span
					v-if="$slots.append
						|| loading
						|| [InputType.SEARCH, InputType.PASSWORD].includes(inputType)"
					class="append"
				>
					<!-- Clearable button -->
					<BaseButton
						v-if="isClearable
							&& !!modelValue
							&& !loading
							&& inputType !== InputType.PASSWORD
							&& !($attrs.disabled || $attrs.readonly)"
						:mode="ButtonMode.CLEAR"
						:button-form="ButtonForm.CIRCLE"
						type="button"
						class="btn-append"
						@click="modelValue = inputType === InputType.NUMBER ? 0 : ''"
					>
						<BaseIcon icon="mdi:clear" />
					</BaseButton>

					<!-- @slot Element shown on the inside right of the input -->
					<slot
						v-if="!loading"
						name="append"
					>
						<!-- Search icon -->
						<BaseIcon
							v-if="inputType === InputType.SEARCH"
							icon="mdi:search"
						/>

						<!-- Toggle password visibility button -->
						<BaseButton
							v-if="inputType === InputType.PASSWORD"
							:mode="ButtonMode.CLEAR"
							:button-form="ButtonForm.INLINE"
							:disabled="(!!($attrs.disabled || loading || $attrs.readonly))"
							type="button"
							class="btn-append"
							@click="showPassword = !showPassword"
						>
							<BaseIcon :icon="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" />
						</BaseButton>
					</slot>

					<BaseIcon
						v-else-if="loading"
						icon="line-md:loading-loop"
					/>
				</span>
			</span>

			<!-- Label -->
			<span
				v-if="!loading && hasSlotContent($slots.default)"
				class="label"
			>
				<!-- @slot Label of the input -->
				<slot />
			</span>
		</label>

		<!-- Error slot -->
		<p
			v-if="!loading && hasError && hasSlotContent($slots.error)"
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
div {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;

	&:has(.input-form-notched-left),
	&:has(.input-form-notched-right) {
		flex: 1;
	}

	label {
		position: relative;

		.input-wrapper {
			width: 100%;
			overflow: hidden;

			&.input-form {
				&-notched-left,
				&-notched-right {
					display: inline-flex;
					position: relative;

					&:before {
						content: '';
						position: absolute;
						background: var(--color-secondary);
						top: 50%;
						transform: translateY(-50%);
						width: 60px;
						height: 60px;
						border-radius: 100%;
						border: 1px solid var(--color-secondary-accent);
					}
				}

				&-notched-left {
					input, textarea {
						border-radius: 0 4px 4px 0;
						padding-left: 22px;
					}

					& ~ .label {
						left: 24px;
					}

					&:before {
						left: -50px;
					}
				}

				&-notched-right {
					input, textarea {
						border-radius: 4px 0 0 4px;
						padding-right: 22px;
					}

					& .append {
						right: 20px;

						&:has(.btn-append:only-child) {
							right: 8px;
						}
					}

					&:before {
						right: -50px;
					}
				}
			}

			&.has-error {
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

				input,
				input:invalid,
				textarea,
				textarea:invalid {
					border-color: var(--color-danger) !important;
					animation: shake 0.2s ease-in-out 0s 2;
				}

				&.input-form {
					&-notched-left,
					&-notched-right {
						&:before {
							border-color: var(--color-danger) !important;
						}
					}
				}
			}

			&:not(:has(:disabled)):focus-within {
				input,
				textarea {
					border-color: var(--color-primary);
				}

				&.input-form {
					&-notched-left,
					&-notched-right {
						&:before {
							border-color: var(--color-primary);
						}
					}
				}
			}

			&:not(:has(:disabled)):focus-within,
			&.has-value {
				&:has(.btn-append) {
					.input {
						padding-right: 42px;
					}
				}

				&:has(.append) {
					.input {
						padding-right: 28px;
					}
				}

				&:has(.append):has(.btn-append) {
					.input {
						padding-right: 70px;
					}
				}

				& ~ .label {
					top: -6px;
					transform: none;
					font-size: var(--font-size-small);
					z-index: 10;

					&:before {
						content: '';
						position: absolute;
						width: calc(100% + 8px);
						height: 100%;
						top: 0;
						left: -4px;
						background: var(--color-secondary);
						z-index: -1;
					}
				}
			}

			input,
			textarea {
				height: 42px;
				width: 100%;
				border: 1px solid var(--color-secondary-accent);
				border-radius: 4px;
				padding: 12px;
				font-size: var(--font-size-body);

				&::placeholder {
					color: transparent;
				}
			}

			.append {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 12px;
				min-width: 16px;

				&:has(.btn-append:only-child) {
					right: 0;
				}
			}

			textarea {
				height: 84px;

				~ .append {
					top: 12px;
					transform: none;

					&:has(.btn-append) {
						top: 0;
					}
				}
			}
		}

		.label {
			position: absolute;
			left: 12px;
			transition: all .15s ease-out;
		}

		:has(input) ~ .label {
			top: 50%;
			transform: translateY(-50%);
		}

		:has(textarea) ~ .label {
			top: 12px;
		}

		&:has(input:read-only),
		&:has(input:disabled),
		&:has(textarea:read-only),
		&:has(textarea:disabled) {
			opacity: .5;
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

/* Delete search clear x */
/* clears the ‘X’ from Chrome */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
	display: none;
}
</style>
