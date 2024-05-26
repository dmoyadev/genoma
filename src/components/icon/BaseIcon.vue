<script setup lang="ts">
import { IconSize } from '@/components/icon/BaseIcon.types.ts';

interface Props {
	icon?: string; /* The icon to display. */
	size?: IconSize; /* The size of the icon. @defaults: IconSize.M */
}

withDefaults(defineProps<Props>(),	{
	size: IconSize.M,
});
</script>

<template>
	<span :class="size">
		<iconify-icon :icon="icon" />
	</span>
</template>

<style scoped lang="scss">
span {
	--icon-s: 12px;
	--icon-m: 16px;
	--icon-l: 24px;
	--icon-xl: 32px;
	--icon-xxl: 48px;

	display: inline-flex;
	align-items: center;
	justify-content: center;

	&.s {
		width: var(--icon-s);
		height: var(--icon-s);
		font-size: var(--icon-s);
		line-height: var(--icon-s);
	}

	&.m {
		width: var(--icon-m);
		height: var(--icon-m);
		font-size: var(--icon-m);
		line-height: var(--icon-m);
	}

	&.l {
		width: var(--icon-l);
		height: var(--icon-l);
		font-size: var(--icon-l);
		line-height: var(--icon-l);
	}

	&.xl {
		width: var(--icon-xl);
		height: var(--icon-xl);
		font-size: var(--icon-xl);
		line-height: var(--icon-xl);
	}

	&.xxl {
		width: var(--icon-xxl);
		height: var(--icon-xxl);
		font-size: var(--icon-xxl);
		line-height: var(--icon-xxl);
	}
}
</style>
