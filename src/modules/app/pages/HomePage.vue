<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@/modules/app/composables/useStorage.ts';

const hasSeenOnboarding = useStorage('onboarding-seen');
hasSeenOnboarding.value = true;

const loading = ref<boolean>(true);
const error = ref();
const data = ref();
</script>

<template>
	<!-- ⏳ Loading state -->
	<template v-if="loading">
		Loading...
	</template>

	<!-- 🚨 Error state -->
	<template v-else-if="error">
		Error
	</template>

	<!-- 📃 Empty state -->
	<template v-else-if="!data">
		Empty
	</template>

	<!-- ✅ Success state -->
	<template v-else>
		Success
	</template>
</template>

<style lang="scss" scoped>

</style>
