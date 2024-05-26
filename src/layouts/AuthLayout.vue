<script setup lang="ts">
import BackgroundImage from '@/modules/auth/components/BackgroundImage.vue';
</script>

<template>
	<header>
		<BackgroundImage />

		<img
			class="logo"
			src="/logo.svg"
			width="180"
			alt="Logo"
		>
	</header>

	<main>
		<slot />
	</main>
</template>

<style lang="scss" scoped>
header {
	height: 260px;
	position: relative;

	.logo {
		position: absolute;
		bottom: -8px;
		left: 20px;
		width: 50%;
		height: auto;
		object-fit: contain;
	}
}

main {
	padding: 20px;
	display: flex;
	flex-direction: column;
	min-height: calc(100svh - 260px);
}
</style>
