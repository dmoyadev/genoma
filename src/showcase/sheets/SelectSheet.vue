<script setup lang="ts">
import { ref } from 'vue';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseSelect from '@/components/select/BaseSelect.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';

const items = ref<{ id: number | string; name: string; icon: string }[]>([
	{ id: 1, name: 'Item 1', icon: 'mdi:car' },
	{ id: 2, name: 'Item 2', icon: 'mdi:warning-circle-outline' },
	{ id: 3, name: 'Item 3', icon: 'mdi:user' },
	{ id: 4, name: 'Item 4', icon: 'mdi:gas-station' },
	{ id: 5, name: 'Item 5', icon: 'mdi:search' },
]);
const selectedItem = ref<{ id: number | string; name: string; icon: string }>();
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			<BaseSelect
				v-model="selectedItem"
				:items
				modal-title="Simple"
			>
				Simple
			</BaseSelect>

			<BaseSelect
				v-model="selectedItem"
				:items
				loading
			>
				Selecciona un elemento
			</BaseSelect>

			<BaseSelect
				v-model="selectedItem"
				:items
				disabled
			>
				Selecciona un elemento
			</BaseSelect>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				custom content
			</template>

			<BaseSelect
				v-model="selectedItem"
				:items
				modal-title="Personalizado"
			>
				Contenido personalizado

				<template
					v-if="selectedItem"
					#content
				>
					<div class="content">
						<BaseIcon :icon="selectedItem.icon" />
						{{ selectedItem.name }}
					</div>
				</template>
			</BaseSelect>

			<BaseSelect
				v-model="selectedItem"
				:items
				disabled
			>
				Contenido personalizado y disabled

				<template
					v-if="selectedItem"
					#content
				>
					<div class="content">
						<BaseIcon :icon="selectedItem.icon" />
						{{ selectedItem.name }}
					</div>
				</template>
			</BaseSelect>

			<BaseSelect
				v-model="selectedItem"
				:items
				modal-title="Personalizado"
			>
				Con items personalizados

				<template
					v-if="selectedItem"
					#content
				>
					<div class="content">
						<BaseIcon :icon="selectedItem.icon" />
						{{ selectedItem.name }}
					</div>
				</template>

				<template #modal-item="{ item }">
					<BaseIcon :icon="item.icon" />
					<span>{{ item.name }}</span>
				</template>
			</BaseSelect>

			<BaseSelect
				v-model="selectedItem"
				:items
				modal-title="Personalizado"
			>
				Con modal personalizado

				<template
					v-if="selectedItem"
					#content
				>
					<div class="content">
						<BaseIcon :icon="selectedItem.icon" />
						{{ selectedItem.name }}
					</div>
				</template>

				<template #modal="{ close }">
					<ul class="modal-list">
						<li
							v-for="item in items"
							:key="item.id"
							@click="close(item)"
						>
							<BaseIcon :icon="item.icon" />
							<span>{{ item.name }}</span>
							<BaseIcon icon="mdi:chevron-right" />
						</li>
					</ul>
				</template>
			</BaseSelect>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				with errors
			</template>

			<BaseSelect
				v-model="selectedItem"
				:items
				has-error
				modal-title="Con error"
			>
				Selecciona un elemento

				<template
					v-if="selectedItem"
					#content
				>
					<div class="content">
						<BaseIcon :icon="selectedItem.icon" />
						{{ selectedItem.name }}
					</div>
				</template>

				<template #error>
					Please select an item
				</template>
			</BaseSelect>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				with helper
			</template>

			<BaseSelect
				v-model="selectedItem"
				:items
				modal-title="Con helper"
			>
				Selecciona un elemento

				<template
					v-if="selectedItem"
					#content
				>
					<div class="content">
						<BaseIcon :icon="selectedItem.icon" />
						{{ selectedItem.name }}
					</div>
				</template>

				<template #helper>
					Try selecting an item
				</template>
			</BaseSelect>
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

	.content {
		display: flex;
		align-items: center;
		gap: 8px;
	}
}

.modal-list {
	display: flex;
	flex-direction: column;

	li {
		display: flex;
		align-items: center;
		padding: 8px 0;
		gap: 12px;

		span {
			margin-right: auto;
		}
	}
}
</style>
