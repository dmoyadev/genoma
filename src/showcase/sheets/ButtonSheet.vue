<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
</script>

<template>
	<section class="sheet">
		<template
			v-for="mode in ButtonMode"
			:key="mode"
		>
			<ShowcaseElements>
				<template #title>
					{{ mode }}
				</template>

				<BaseButton
					v-for="(color, c) in ButtonColor"
					:key="c"
					:color="color"
					:mode="mode"
				>
					{{ color }}
				</BaseButton>

				<BaseButton
					v-for="(form, f) in ButtonForm"
					:key="f"
					:button-form="form"
					:mode="mode"
				>
					{{ form }}
				</BaseButton>
			</ShowcaseElements>
		</template>
	</section>
</template>

<style scoped lang="scss">
.sheet {
	padding: 16px 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	overflow-x: auto;
}

.icon {
	margin-right: 8px;
}
</style>
