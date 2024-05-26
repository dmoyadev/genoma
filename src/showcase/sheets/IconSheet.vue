<script setup lang="ts">
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			<BaseIcon
				icon="line-md:loading-loop"
				:size="IconSize.XXL"
			/>

			<BaseIcon
				icon="mdi:check-circle-outline"
				:size="IconSize.XL"
			/>

			<BaseIcon
				icon="mdi:gas-station"
				:size="IconSize.L"
			/>

			<BaseIcon icon="mdi:oil" />

			<BaseIcon
				icon="mdi:search"
				:size="IconSize.S"
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
