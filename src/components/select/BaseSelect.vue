<script setup lang="ts" generic="T extends { id: number | string }">
import { computed, ref, watch } from 'vue';
import { hasSlotContent, normalize } from '@/utils/helpers.ts';
import BaseModal from '@/components/modal/BaseModal.vue';
import { InputType } from '@/components/input/BaseInput.types.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import BaseButton from '@/components/button/BaseButton.vue';

interface Props {
	items: T[]; /* The items to be shown in the select */
	modalTitle?: string; /* The title of the modal */
	customValidity?: string; /* The error message of the select */
	hasError?: boolean; /* Indicates if the select has an error. Determines if the `error` slot will be shown */
	loading?: boolean; /* Indicates if the select is loading */
	required?: boolean; /* Indicates if the select is required */
	disabled?: boolean; /* Indicates if the select is disabled */
}

const props = defineProps<Props>();
const emit = defineEmits<{ openModal: [] }>();

const modelValue = defineModel<T>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const $input = ref<HTMLInputElement>();
watch(() => props.hasError, (value) => {
	if (!$input.value) {
		return;
	}

	$input.value.setCustomValidity((value && props.customValidity) ? props.customValidity : '');
});

const showModal = ref(false);

const searchQuery = ref('');
const filteredItems = computed(() => {
	return props.items.filter((item) => {
		const itemValues = Object.values(item) as string[];
		return itemValues.some(value => normalize(value).includes(normalize(searchQuery.value)));
	});
});

function openModal() {
	if (props.disabled || props.loading) {
		return;
	}

	showModal.value = true;
	emit('openModal');
}

function selectItem(item: T) {
	modelValue.value = item;
	showModal.value = false;
}
</script>

<template>
	<div
		v-bind="$attrs"
		class="container"
		@click="openModal()"
	>
		<div class="label-wrapper">
			<span
				class="input-wrapper"
				:class="{
					'has-value': !!modelValue,
					'has-error': hasError,
					'is-disabled': disabled || loading,
				}"
			>
				<span class="input">
					<input
						:id="($attrs.id as string) || _componentUID"
						ref="$input"
						v-model="modelValue"
						:required
						type="hidden"
					>

					<!-- @slot Label of the input -->
					<slot name="content">
						<slot v-if="!modelValue" />
						<template v-else>
							{{ modelValue }}
						</template>
					</slot>
				</span>

				<!-- Icon right -->
				<span class="append">
					<!-- Clearable button -->
					<BaseButton
						v-if="!!modelValue
							&& !loading
							&& !disabled"
						:mode="ButtonMode.CLEAR"
						:button-form="ButtonForm.CIRCLE"
						type="button"
						class="btn-append"
						@click.stop="modelValue = undefined"
					>
						<BaseIcon icon="mdi:clear" />
					</BaseButton>

					<!-- Loading icon -->
					<BaseIcon
						v-if="!loading"
						icon="mdi:chevron-right"
					/>

					<!-- Loading icon -->
					<BaseIcon
						v-else
						icon="line-md:loading-loop"
					/>
				</span>
			</span>

			<!-- Label -->
			<span
				v-if="!!modelValue
					&& !loading
					&& hasSlotContent($slots.default)"
				class="label"
			>
				<!-- @slot How the content will be shown -->
				<slot>
					{{ modelValue }}
				</slot>
			</span>
		</div>

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

	<BaseModal
		v-if="showModal"
		:title="modalTitle"
		@close="showModal = false"
	>
		<!-- @slot Content of the select modal -->
		<slot
			name="modal"
			:close="(item: T) => selectItem(item)"
		>
			<div class="modal-content">
				<BaseInput
					v-model="searchQuery"
					:input-type="InputType.SEARCH"
				>
					Buscar por nombre
				</BaseInput>

				<ul>
					<li
						v-for="item in filteredItems"
						:key="item.id"
						:class="{ selected: item.id === modelValue?.id }"
						@click="selectItem(item)"
					>
						<slot
							name="modal-item"
							:item="item"
						>
							{{ item }}
						</slot>
						<BaseIcon icon="mdi:chevron-right" class="icon-chevron" />
					</li>
				</ul>
			</div>
		</slot>
	</BaseModal>
</template>

<style scoped lang="scss">
.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;

	.label-wrapper {
		position: relative;

		.input-wrapper {
			overflow: hidden;

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

				.input {
					border-color: var(--color-danger);
					animation: shake 0.2s ease-in-out 0s 2;
				}

				.append {
					color: var(--color-danger);
				}
			}

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

			.input {
				display: block;
				height: 42px;
				width: 100%;
				border: 1px solid var(--color-secondary-accent);
				border-radius: 4px;
				padding: 12px;
				font-size: var(--font-size-body);
			}

			.append {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 12px;
				min-width: 16px;
			}
		}

		.label {
			position: absolute;
			left: 12px;
			transition: all .15s ease-out;
		}

		:has(.input) ~ .label {
			top: 50%;
			transform: translateY(-50%);
		}

		&:has(.input-wrapper.is-disabled) {
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

.modal-content {
	padding: 8px 16px 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;

	ul {
		display: flex;
		flex-direction: column;

		li {
			display: flex;
			align-items: center;
			padding: 8px 0;
			gap: 12px;

			&.selected {
				color: var(--color-primary);
			}

			.icon-chevron {
				margin-left: auto;
			}
		}
	}
}
</style>
