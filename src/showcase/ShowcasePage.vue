<script setup lang="ts">
import AvatarSheet from '@/showcase/sheets/AvatarSheet.vue';
import InputSheet from '@/showcase/sheets/InputSheet.vue';
import ComponentShowcase from '@/showcase/ComponentShowcase.vue';
import ButtonSheet from '@/showcase/sheets/ButtonSheet.vue';
import IconSheet from '@/showcase/sheets/IconSheet.vue';
import ModalSheet from '@/showcase/sheets/ModalSheet.vue';
import RadioSheet from '@/showcase/sheets/RadioSheet.vue';
import SelectSheet from '@/showcase/sheets/SelectSheet.vue';
import StepperSheet from '@/showcase/sheets/StepperSheet.vue';
import SwitchSheet from '@/showcase/sheets/SwitchSheet.vue';

const sheets = [
	{
		name: 'Avatar',
		component: AvatarSheet,
	},
	{
		name: 'Button',
		component: ButtonSheet,
	},
	{
		name: 'Input',
		component: InputSheet,
	},
	{
		name: 'Icon',
		component: IconSheet,
	},
	{
		name: 'Modal',
		component: ModalSheet,
	},
	{
		name: 'Radio',
		component: RadioSheet,
	},
	{
		name: 'Select',
		component: SelectSheet,
	},
	{
		name: 'Stepper',
		component: StepperSheet,
	},
	{
		name: 'Switch',
		component: SwitchSheet,
	},
];
</script>

<template>
	<main>
		<ComponentShowcase
			v-for="(sheet, index) in sheets"
			:key="index"
			:sheet="sheet"
		/>
	</main>
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
