<script setup lang="ts">
import { ref } from 'vue';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseRadio from '@/components/radio/BaseRadio.vue';
import BaseRadioGroup from '@/components/radio/BaseRadioGroup.vue';

const selectedElement = ref();
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			selected: {{ selectedElement }}

			<br>

			<BaseRadio
				v-model="selectedElement"
				name="test"
				:value="{ id: 1, name: 'Test 1' }"
			>
				Test 1
			</BaseRadio>

			<BaseRadio
				v-model="selectedElement"
				name="test"
				:value="{ id: 2, name: 'Test 2' }"
			>
				Test 2
			</BaseRadio>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				group
			</template>

			selected: {{ selectedElement }}

			<br>

			<BaseRadioGroup
				v-model="selectedElement"
				:options="[{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }]"
				required
			>
				<template #radio-label="{ option }">
					{{ option.name }}
				</template>
			</BaseRadioGroup>

			<BaseRadioGroup
				v-model="selectedElement"
				:options="[{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }, { id: 3, name: 'Test disabled' }]"
				required
				:is-disabled="(option) => option.id === 3"
			>
				<template #radio-label="{ option }">
					{{ option.name }}
				</template>
			</BaseRadioGroup>

			<BaseRadioGroup
				v-model="selectedElement"
				:options="[{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }]"
				has-error
			>
				<template #radio-label="{ option }">
					{{ option.name }}
				</template>

				<template #error>
					This is an error
				</template>
			</BaseRadioGroup>

			<BaseRadioGroup
				v-model="selectedElement"
				:options="[{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }]"
			>
				<template #radio-label="{ option }">
					{{ option.name }}
				</template>

				<template #helper>
					This is a helper
				</template>
			</BaseRadioGroup>
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
