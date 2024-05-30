<script setup lang="ts">
import * as pkg from '../../package.json';
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

		<small>
			v.{{ pkg.version }}
			<br>
			Continuando, indicas que aceptas nuestros
			<a href="#">Términos y condiciones</a> y la <a href="#">Política de privacidad</a>
		</small>
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

	small {
		margin-top: auto;
		align-self: center;
		display: block;
		font-size: var(--font-size-legal);
		color: var(--color-primary);
		text-align: center;
		max-width: 230px;

		a {
			color: var(--color-secondary-accent);
			font-size: var(--font-size-legal);
			text-decoration: underline;
		}
	}
}
</style>
