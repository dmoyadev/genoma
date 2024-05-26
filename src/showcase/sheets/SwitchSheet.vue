<script setup lang="ts">
import { ref } from 'vue';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';

const isActive = ref(false);
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			isActive: {{ isActive }}

			<br>

			<BaseSwitch
				v-model="isActive"
				name="test"
				:value="{ id: 1, name: 'Hola!' }"
			>
				Hola!
			</BaseSwitch>

			<BaseSwitch
				v-model="isActive"
				name="test"
				disabled
				:value="{ id: 2, name: 'Eh...!' }"
			>
				Desactivado...
			</BaseSwitch>
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

.input {
	width: 100%;
}
</style>
