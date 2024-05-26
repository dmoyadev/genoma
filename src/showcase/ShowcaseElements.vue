<template>
	<div class="elements">
		<span class="title">
			<slot name="title" />
		</span>

		<slot />
	</div>
</template>

<style scoped lang="scss">
.elements {
	border: 1px dashed var(--color-gray-4);
	padding: 32px 8px 8px;
	border-radius: 4px;
	width: 100%;
	position: relative;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;

	.title {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: var(--color-gray-2);
		border-radius: 4px 4px 0 0;
		padding: 2px 4px;
		display: block;
		font-size: 10px;
		color: var(--color-gray-6);
	}
}
</style>
