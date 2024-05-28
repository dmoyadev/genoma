<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';

const { people } = usePeopleService();
</script>

<template>
	<header>
		<img
			class="logo"
			src="/logo.svg"
			width="180"
			alt="Logo"
		>

		<BaseButton
			:button-form="ButtonForm.INLINE"
			:mode="ButtonMode.CLEAR"
			:to="people.length ? '/' : '/people/__new__'"
		>
			Saltar
		</BaseButton>
	</header>

	<slot />
</template>

<style scoped lang="scss">
header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 16px;
	margin-bottom: 32px;
}
</style>
