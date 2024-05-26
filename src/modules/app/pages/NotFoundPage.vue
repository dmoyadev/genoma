<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
</script>

<template>
	<main>
		Esta página no existe

		<BaseButton to="/">
			Volver al inicio
		</BaseButton>
	</main>
</template>

<style lang="scss" scoped>
main {
	min-height: 100svh;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
}
</style>
