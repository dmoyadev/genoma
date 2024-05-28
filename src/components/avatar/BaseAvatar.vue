<script setup lang="ts">
interface Props {
	size?: number; /* The size of the avatar. @defaults: 40 */
	src?: string; /* The source of the image. @defaults: undefined */
	alt?: string; /* The alt text of the image. @defaults: undefined */
}
withDefaults(defineProps<Props>(), {
	size: 40,
});

function getAvatarURL(size: number, name: string = '') {
	const color1 = '77A3E3';
	const color2 = '0F1939';
	const colorsQuery = `colors=${color1},${color2},${color2},${color1},${color1}`;
	return `https://source.boringavatars.com/beam/${size}/${name}?${colorsQuery}`;
}
</script>

<template>
	<img
		:src="src || getAvatarURL(40, alt)"
		:alt="alt || src"
		:width="size"
		:height="size"
	>
</template>

<style scoped lang="scss">
img {
	border-radius: 50%;
	width: v-bind('`${size}px`');
	height: v-bind('`${size}px`');
	object-fit: cover;
	border: 2px solid var(--color-gray-0);
	box-shadow: 0 4px 24px 0 rgba(0, 0, 0, .1);
}
</style>
