<script setup lang="ts">
import { IconSize } from '@/components/icon/BaseIcon.types.ts';

interface Props {
	icon?: string; /* The icon to display. */
	size?: IconSize | number; /* The size of the icon. @defaults: IconSize.M */
}

withDefaults(defineProps<Props>(),	{
	size: IconSize.M,
});
</script>

<template>
	<iconify-icon
		:icon="icon"
		:width="`${size}px`"
		:height="`${size}px`"
	/>
</template>
