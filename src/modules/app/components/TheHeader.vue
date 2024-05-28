<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';

defineProps<{
	title?: string; /* The title of the page */
	disallowBack?: boolean; /* Whether the back button should be hidden */
	backPage?: string; /* The page to go back to */
	actionText?: string; /* The text of the main action button */
	actionForm?: string; /* The id of the form that the main action button should submit */
	disableAction?: boolean; /* Whether the main action button should be disabled */
}>();

defineEmits<{
	clickAction: []; /* Emitted when the action button is clicked */
}>();
</script>

<template>
	<header>
		<BaseButton
			v-if="!disallowBack"
			:mode="ButtonMode.CLEAR"
			:button-form="ButtonForm.CIRCLE"
			:to="backPage"
			class="btn-back"
			@click="!backPage && $router.back()"
		>
			<BaseIcon icon="mdi:arrow-left" />
		</BaseButton>

		<h1 v-if="title">
			{{ title }}
		</h1>

		<BaseButton
			v-if="actionText"
			:mode="ButtonMode.CLEAR"
			:button-form="ButtonForm.INLINE"
			:disabled="disableAction"
			:form="actionForm"
			class="btn-action"
			@click="() => $emit('clickAction')"
		>
			{{ actionText }}
		</BaseButton>
	</header>
</template>

<style scoped lang="scss">
header {
	display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;

	&:not(:has(.btn-back)) {
		padding-left: 16px;
	}

	h1 {
		text-transform: uppercase;
		font-size: var(--font-size-small);
	}

	.btn-action {
		margin-left: auto;
	}
}
</style>
