<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';

defineProps<{
	sheet: { name: string; component: any };
}>();

const show = ref(false);
</script>

<template>
	<h1 @click="show = !show">
		{{ sheet.name }}
		<BaseButton
			:mode="ButtonMode.CLEAR"
			:color="ButtonColor.GRAYSCALE"
			:button-form="ButtonForm.INLINE"
		>
			<BaseIcon :icon="show ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
		</BaseButton>
	</h1>

	<component
		:is="sheet.component"
		v-if="show"
	/>
</template>

<style scoped lang="scss">
main {
	padding: 16px;
	display: flex;
	flex-direction: column;

	h1 {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	h1:not(:first-child) {
		margin-top: 16px;
	}
}
</style>
