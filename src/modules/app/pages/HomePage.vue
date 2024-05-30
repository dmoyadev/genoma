<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStorage } from '@/modules/app/composables/useStorage.ts';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';
import { normalize } from '@/utils/helpers.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/BaseInput.types.ts';
import type { Familiar } from '@/modules/people/models/Person.ts';
import PersonRow from '@/modules/people/components/PersonRow.vue';
import BaseButton from '@/components/button/BaseButton.vue';

const hasSeenOnboarding = useStorage('onboarding-seen');
hasSeenOnboarding.value = true;

const { loading, getPeople } = usePeopleService();
getPeople();
const { relations } = useTreeService();

const searchQuery = ref<string>();

const filteredRelations = computed<Record<number, Familiar[]>>(() => {
	const query = normalize(searchQuery.value);

	// Remove all sixth degree relations
	const knownPeople = { ...relations.value };
	delete knownPeople[6];

	if (!query) {
		return knownPeople;
	}

	const filteredRelations: Record<string, Familiar[]> = {};

	for (const [grade, familiars] of Object.entries(knownPeople)) {
		const filteredFamiliars = familiars.filter((familiar) => {
			const searchableFields = [
				familiar.data.name,
				familiar.data.firstSurname,
				familiar.data.secondSurname,
			];
			return searchableFields.some(value => normalize(value).includes(query));
		});

		if (filteredFamiliars.length) {
			filteredRelations[grade] = filteredFamiliars;
		}
	}

	return filteredRelations;
});
</script>

<template>
	<!-- ⏳ Loading state -->
	<template v-if="loading">
		<BaseIcon
			icon="line-md:loading-loop"
			:size="IconSize.XXL"
			class="icon-loading"
		/>
	</template>

	<!-- ✅ Success state -->
	<template v-else>
		<!-- TODO Add message when query params has data -->

		<header>
			<BaseInput
				v-model="searchQuery"
				:input-type="InputType.SEARCH"
			>
				Buscar...
			</BaseInput>
		</header>

		<main>
			<div
				v-for="(grade, name) in filteredRelations"
				:key="name"
				class="relations"
			>
				<h2>Familiares de grado {{ name }}</h2>
				<ul>
					<PersonRow
						v-for="person in grade"
						:key="person.data.id"
						:person
					/>
				</ul>
			</div>

			<div
				v-if="!loading && !searchQuery && !Object.keys(filteredRelations).length"
				class="empty"
			>
				<BaseIcon icon="mdi:progress-question" :size="IconSize.XL" />
				No hay ninguna persona en tu árbol.

				<BaseButton to="/people/__new__">
					Empieza creando una nueva persona
				</BaseButton>
			</div>

			<div
				v-else-if="!loading && searchQuery && !Object.keys(filteredRelations).length"
				class="empty"
			>
				<BaseIcon icon="mdi:progress-question" :size="IconSize.XL" />
				Ninguna persona de la lista corresponde con la búsqueda.

				<BaseButton @click="searchQuery = undefined">
					Borrar búsqueda
				</BaseButton>
			</div>
		</main>
	</template>
</template>

<style lang="scss" scoped>
.icon-loading {
	margin: auto;
}

header {
	position: fixed;
	top: 0;
	width: 100%;
	padding: 16px;
	display: flex;
	align-items: center;

	/* Glass effect */
	background: var(--color-secondary-alpha);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
}

main {
	--header-height: 74px;
	flex: 1;
	padding: calc(74px) 16px 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;

	.relations {
		margin: 0 -16px;

		h2 {
			padding: 8px 16px;
			background: var(--color-primary);
			color: var(--color-primary-accent);
			text-transform: uppercase;
			font-size: var(--font-size-small);
		}
	}

	.empty {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
		color: var(--color-gray-4);
	}
}
</style>
