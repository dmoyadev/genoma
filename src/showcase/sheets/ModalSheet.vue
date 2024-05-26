<script setup lang="ts">
import { ref } from 'vue';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseModal from '@/components/modal/BaseModal.vue';

const isOpen = ref(false);
const isSmallOpen = ref(false);
const isBigContentOpen = ref(false);
const total = ref(10);
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			<BaseButton @click="isOpen = !isOpen">
				Open modal
			</BaseButton>

			<BaseModal
				v-if="isOpen"
				title="Modal Title"
				@close="isOpen = false"
			>
				Test content!
			</BaseModal>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				small
			</template>

			<BaseButton @click="isSmallOpen = !isSmallOpen">
				Open small modal
			</BaseButton>

			<BaseModal
				v-if="isSmallOpen"
				title="Small Modal Title"
				:size="30"
				@close="isSmallOpen = false"
			>
				Small test content!
			</BaseModal>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				modal with scroll
			</template>

			<BaseButton @click="isBigContentOpen = !isBigContentOpen">
				Open overflow modal
			</BaseButton>

			<BaseModal
				v-if="isBigContentOpen"
				title="Big Modal Title"
				:size="50"
				@close="isBigContentOpen = false"
			>
				<BaseButton @click="total < 100 ? total = 100 : total = 10">
					Make it overflow
				</BaseButton>
				<ul>
					<li v-for="i in total">
						Item {{ i }}
					</li>
				</ul>
			</BaseModal>
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
