<script setup lang="ts">
import { useStorage } from '@/modules/app/composables/useStorage.ts';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';

const hasSeenOnboarding = useStorage('onboarding-seen');
hasSeenOnboarding.value = true;

const { people, loading } = usePeopleService();
</script>

<template>
	<br>
	<!-- ⏳ Loading state -->
	<template v-if="loading">
		Loading...
	</template>

	<!-- 📃 Empty state -->
	<template v-else-if="!people?.length">
		Empty
	</template>

	<!-- ✅ Success state -->
	<template v-else>
		<p style="background: var(--color-success); color: var(--color-success-accent)">
			{{ people.find(p => p.id === $route.query?.created)?.name || 'ni idea' }} se ha creado!
		</p>
		<p v-for="person in people" :key="person.id">
			{{ person }}
			<br>
			<br>
		</p>
	</template>
</template>

<style lang="scss" scoped>

</style>
