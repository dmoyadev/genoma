<script setup lang="ts">
import { watch } from 'vue';
import { useStorage } from '@/modules/app/composables/useStorage.ts';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import PersonCard from '@/modules/people/components/PersonCard.vue';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';

const hasSeenOnboarding = useStorage('onboarding-seen');
hasSeenOnboarding.value = true;

const { people, loading } = usePeopleService();
const { root } = useTreeService();
watch(people, (value) => {
	if (value.length) {
		root.value = value[0];
	}
});
</script>

<template>
	<!-- ⏳ Loading state -->
	<template v-if="loading">
		<BaseIcon
			icon="line-md:loading-loop"
			:size="IconSize.XXL"
			class="icon-loading"
		/>
	</template>

	<!-- ✅ Success state -->
	<template v-else>
		<!-- TODO Add message when query params has data -->

		<main>
			<PersonCard
				v-if="root"
				ref="$mainCard"
				:key="root.id"
				:person="root"
				:generation="0"
				class="main-card"
			/>
		</main>
	</template>
</template>

<style lang="scss" scoped>
.icon-loading {
	margin: auto;
}

main {
	position: absolute;
	inset: 0;
	overflow: auto;

	&:deep(article.main-card) {
		border: 1px solid var(--color-primary);
	}
}
</style>
