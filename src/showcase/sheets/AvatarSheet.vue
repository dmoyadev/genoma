<script setup lang="ts">
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseAvatar from '@/components/avatar/BaseAvatar.vue';
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				With src
			</template>

			<template
				v-for="size in [40, 80, 120]"
				:key="size"
			>
				<BaseAvatar
					src="https://avatars.githubusercontent.com/u/9676003"
					alt="This is the avatar"
					:size="size"
				/>
			</template>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				Without src
			</template>

			<template
				v-for="size in [40, 80, 120]"
				:key="size"
			>
				<BaseAvatar
					alt="Test"
					:size="size"
				/>
			</template>
		</ShowcaseElements>
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
</style>
