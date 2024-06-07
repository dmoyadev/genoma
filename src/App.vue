<script setup lang="ts">
import { RouterView } from 'vue-router';

document.addEventListener('gesturestart', (e) => {
	e.preventDefault();
	// @ts-expect-error - This is a hack to prevent the pinch to zoom
	document.body.style.zoom = 0.99;
});
document.addEventListener('gesturechange', (e) => {
	e.preventDefault();
	// @ts-expect-error - This is a hack to prevent the pinch to zoom
	document.body.style.zoom = 0.99;
});
document.addEventListener('gestureend', (e) => {
	e.preventDefault();
	// @ts-expect-error - This is a hack to prevent the pinch to zoom
	document.body.style.zoom = 1;
});
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
	width: 100%;
	height: 100%;
}
</style>
