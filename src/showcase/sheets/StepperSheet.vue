<script setup lang="ts">
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseStepper from '@/components/stepper/BaseStepper.vue';
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				3 steps
			</template>

			<BaseStepper
				:total="3"
				:current="2"
			/>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				5 steps
			</template>

			<BaseStepper
				:total="5"
				:current="2"
			/>
		</ShowcaseElements>
	</section>
</template>

<style scoped lang="scss">
.sheet {
	padding: 16px 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	overflow-x: auto;
}
</style>
