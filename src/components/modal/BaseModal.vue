<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import BaseButton from '@/components/button/BaseButton.vue';

interface Props {
	closeBtnText?: string; /* The text of the close button */
	title?: string; /* The title of the modal */
	size?: number; /* The percentage of aperture from top of the screen. @defaults: 96 */
}

const props = withDefaults(defineProps<Props>(),	{
	size: 96,
});

defineEmits<{
	/**
	 * Emitted when the modal is closed
	 */
	close: [];
}>();

const $modal = ref<HTMLElement>();
onMounted(() => {
	if (!$modal.value) {
		return;
	}

	const initialSize = window.innerHeight * props.size / 100;
	$modal.value.style.height = `${initialSize}px`;
	$modal.value.style.maxHeight = `${initialSize}px`;
});

onBeforeUnmount(() => {
	if (!$modal.value) {
		return;
	}

	$modal.value.style.height = '0px';
	$modal.value.style.maxHeight = '0px';
});
</script>

<template>
	<Teleport to="body">
		<div
			class="overlay"
			@click="$emit('close')"
		/>

		<dialog
			v-bind="$attrs"
			ref="$modal"
			class="modal"
			:style="{ '--modal-height': `${size}dvh` }"
			open
		>
			<header>
				<!-- Close button -->
				<BaseButton
					class="btn-close"
					:mode="ButtonMode.CLEAR"
					:button-form="ButtonForm.INLINE"
					@click="$emit('close')"
				>
					{{ closeBtnText || 'Cancelar' }}
				</BaseButton>

				<span
					v-if="title"
					class="title"
				>
					{{ title }}
				</span>

				<div class="header-action">
					<!-- @slot Main action of the modal -->
					<slot name="header-action" />
				</div>
			</header>

			<main>
				<!-- @slot The main content of the modal -->
				<slot />
			</main>
		</dialog>
	</Teleport>
</template>

<style scoped lang="scss">
.overlay {
	position: fixed;
	inset: 0;
	content: '';
	background: rgba(0, 0, 0, 0.2);
	z-index: 1999;
}

dialog {
	--header-height: 58px;
	--base-border-radius: 8px 8px 0 0;
	position: absolute;
	background: var(--color-secondary);
	color: var(--color-secondary-accent);
	width: 100%;
	bottom: 0;
	max-height: 0;
	transition: all .1s;
	border-radius: var(--base-border-radius);
	z-index: 2000;
	border: none;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	header {
		position: absolute;
		top: 0;
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: var(--base-border-radius);
		padding: 8px 4px;
		width: 100%;

		/* Glass effect */
		background: var(--color-secondary-alpha);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);

		.btn-close {
			display: flex;
			justify-content: flex-start;
		}

		.title {
			text-align: center;
			color: var(--color-secondary-accent);
		}

		.header-action {
			min-width: 90px;
			display: flex;
			justify-content: flex-end;
		}
	}

	main {
		overflow-y: auto;
		padding-top: var(--header-height);
		min-height: calc(var(--modal-height) - var(--header-height));
	}
}
</style>

<style lang="scss">
body:has(.modal) {
	background: black;

	#app {
		border-radius: 8px;
		position: fixed;
		overflow: hidden;
		transform: scale(.95, .97);
		transition: transform .2s;
	}
}
</style>
