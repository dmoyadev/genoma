<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<RouterView :key="$route.fullPath" />
</template>

<style lang="scss">
body, #app {
	background: var(--color-secondary);
	color: var(--color-secondary-accent);
	min-width: 100dvw;
	min-height: 100dvh;
	overflow-x: hidden;
}

#app {
	display: flex;
	flex-direction: column;
}
</style>
