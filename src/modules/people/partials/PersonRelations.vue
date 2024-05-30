<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Marriage, Person } from '@/modules/people/models/Person.ts';
import { RelationCode } from '@/modules/people/models/Person.ts';
import BaseButton from '@/components/button/BaseButton.vue';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import PersonRow from '@/modules/people/components/PersonRow.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';

const props = defineProps<{ person: Person }>();

const { people } = usePeopleService();
const { updateRelations } = useTreeService();
const route = useRoute();
if (route.query.created) {
	updateRelations();
}

const parents = computed<Person[]>(() => {
	const parents: Person[] = [];

	if (props.person.relationships?.firstParentID) {
		parents[0] = people.value[props.person.relationships.firstParentID];
	}

	if (props.person.relationships?.secondParentID) {
		parents[1] = people.value[props.person.relationships.secondParentID];
	}

	return parents;
});

const siblings = computed<Person[]>(() => {
	return props.person.relationships?.siblingsIDs?.map(id => people.value[id]) || [];
});

const marriages = computed<Marriage[]>(() => props.person.relationships?.marriages || []);

function getSpouseFullName(spouseID: string) {
	const spouse = people.value[spouseID];
	return `${spouse.name ? spouse.name : ''}
	${spouse.firstSurname ? ` ${spouse.firstSurname}` : ''}
	${spouse.secondSurname ? ` ${spouse.secondSurname}` : ''}`;
}

function getQueryParams(relation: RelationCode, marriage?: Marriage): string {
	const neededProperties: Record<string, any> = {
		id: props.person.id,
		relationCode: relation,
	};

	switch (relation) {
		case RelationCode.PARENT: // Creating a parent (share one surname)
			if (!parents.value.length) { // No parents. Going to create a father
				neededProperties.firstSurname = props.person.firstSurname;
			} else if (parents.value[0]) { // Going to create a mother
				neededProperties.spouseID = parents.value[0].id;
				neededProperties.firstSurname = props.person.secondSurname;
			} else { // Going to create a father
				neededProperties.spouseID = parents.value[1].id;
				neededProperties.firstSurname = props.person.firstSurname;
			}
			break;

		case RelationCode.SIBLING: // Creating a sibling (share both surnames)
			neededProperties.firstSurname = props.person.firstSurname;
			neededProperties.secondSurname = props.person.secondSurname;
			break;

		case RelationCode.SPOUSE: // Creating a spouse (share children)
			neededProperties.childrenIDs = marriage?.childrenIDs;
			if (marriage?.childrenIDs?.length) {
				neededProperties.firstSurname = people.value[marriage.childrenIDs[0]]?.secondSurname;
			}
			break;

		case RelationCode.CHILD: { // Creating a child (share both parents)
			const isMale = props.person.gender === 'male';
			const hasSpouse = marriage?.spouseID;
			const firstSurname = props.person.firstSurname;
			const spouseFirstSurname = hasSpouse ? people.value[marriage!.spouseID!].firstSurname : null;

			if (hasSpouse) {
				neededProperties.spouseID = marriage.spouseID;
				neededProperties.firstSurname = isMale ? firstSurname : spouseFirstSurname;
				neededProperties.secondSurname = isMale ? spouseFirstSurname : props.person.secondSurname;
			} else {
				neededProperties.firstSurname = isMale ? firstSurname : null;
				neededProperties.secondSurname = isMale ? null : props.person.secondSurname;
			}
			break;
		}

		default: break;
	}

	const queryParams = Object.entries(neededProperties)
		.filter(p => p[0] !== 'tab' && !!p[1])
		.map(p => `${p[0]}=${p[1]}`)
		.join('&');
	return queryParams ? `?${queryParams}` : '';
}
</script>

<template>
	<section class="relations">
		<div class="list">
			<h2>
				<span>Padres/Madres</span>

				<BaseButton
					:button-form="ButtonForm.INLINE"
					:mode="ButtonMode.OUTLINE"
					class="btn-add"
					:disabled="parents.length === 2"
					:to="`/people/__new__${getQueryParams(RelationCode.PARENT)}`"
				>
					<BaseIcon icon="mdi:user-add" />
					Crear
				</BaseButton>
			</h2>

			<!-- ❌ Error state -->
			<small
				v-if="parents.length === 2"
				class="helper"
			>
				<BaseIcon icon="mdi:alert-circle" />
				Ya tiene el máximo de padres/madres asociados.
			</small>

			<!-- ✅ Data -->
			<ul v-if="parents.length">
				<PersonRow
					v-for="parent in parents.filter(Boolean)"
					:key="parent.id"
					:person="parent"
				/>
			</ul>

			<!-- 📭 Empty state -->
			<div
				v-else
				class="empty"
			>
				<BaseIcon icon="mdi:progress-question" :size="IconSize.XL" />
				Aún no tiene padres/madres asociados.
			</div>
		</div>

		<div class="list">
			<h2>
				<span>Hermanos/Hermanas</span>

				<BaseButton
					:button-form="ButtonForm.INLINE"
					:mode="ButtonMode.OUTLINE"
					class="btn-add"
					:to="`/people/__new__${getQueryParams(RelationCode.SIBLING)}`"
				>
					<BaseIcon icon="mdi:user-add" />
					Crear
				</BaseButton>
			</h2>

			<!-- ✅ Data -->
			<ul v-if="siblings.length">
				<PersonRow
					v-for="sibling in siblings"
					:key="sibling.id"
					:person="sibling"
				/>
			</ul>

			<!-- 📭 Empty state -->
			<div
				v-else
				class="empty"
			>
				<BaseIcon icon="mdi:progress-question" :size="IconSize.XL" />
				Aún no tiene hermanos/hermanas asociados.
			</div>
		</div>

		<div class="list">
			<h2>
				<span>Parejas/Matrimonios</span>

				<BaseButton
					:button-form="ButtonForm.INLINE"
					:mode="ButtonMode.OUTLINE"
					class="btn-add"
					:to="`/people/__new__${getQueryParams(RelationCode.SPOUSE)}`"
				>
					<BaseIcon icon="mdi:user-add" />
					Crear
				</BaseButton>
			</h2>

			<!-- ✅ Data -->
			<template v-if="marriages.length">
				<div
					v-for="(marriage, index) in marriages"
					:key="index"
					class="family-unit"
				>
					<h3>
						<template v-if="marriage.spouseID">
							<span>{{ `Con ${getSpouseFullName(marriage.spouseID)}` }}</span>
						</template>

						<template v-else>
							<span>Sin otro padre/madre</span>
						</template>
					</h3>

					<ul>
						<PersonRow
							v-if="marriage.spouseID"
							:person="people[marriage.spouseID]"
						/>
						<BaseButton
							v-else
							:mode="ButtonMode.OUTLINE"
							class="btn-add"
							:to="`/people/__new__${getQueryParams(RelationCode.SPOUSE, marriage)}`"
						>
							Crear padre/madre de estos hijos/as
						</BaseButton>

						<BaseButton
							v-if="marriage.spouseID"
							:mode="ButtonMode.OUTLINE"
							class="btn-add"
							:to="`/people/__new__${getQueryParams(RelationCode.CHILD, marriage)}`"
						>
							{{ marriage.childrenIDs?.length ? 'Crear otro hijo/hija' : 'Crear un hijo/hija de esta pareja' }}
						</BaseButton>

						<template v-if="marriage.childrenIDs?.length">
							<PersonRow
								v-for="childID in marriage.childrenIDs"
								:person="people[childID]"
							/>
						</template>
					</ul>
				</div>
			</template>

			<!-- 📭 Empty state -->
			<div
				v-else
				class="empty"
			>
				<BaseIcon icon="mdi:progress-question" :size="IconSize.XL" />
				Aún no tiene parejas/matrimonios ni hijos asociados.
			</div>

			<BaseButton
				:mode="ButtonMode.OUTLINE"
				class="btn-add"
				:to="`/people/__new__${getQueryParams(RelationCode.CHILD)}`"
			>
				Crear un hijo/hija
			</BaseButton>
		</div>
	</section>
</template>

<style scoped lang="scss">
.relations {
	display: flex;
	flex-direction: column;
	gap: 32px;

	.list {
		display: flex;
		flex-direction: column;
		gap: 8px;

		h2 {
			display: flex;
			align-items: center;
			justify-content: space-between;

			span {
				text-transform: uppercase;
				font-size: var(--font-size-small);
			}

			.btn-add {
				display: flex;
				align-items: center;
				gap: 8px;
			}
		}

		.helper {
			display: flex;
			align-items: flex-start;
			gap: 4px;
			color: var(--color-primary);
		}

		.empty {
			margin: 16px;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8px;
			text-align: center;
			color: var(--color-gray-4);
		}

		.family-unit {
			padding-left: 16px;

			&:not(:last-of-type) {
				margin-bottom: 24px;
			}

			h3 {
				display: flex;
				align-items: center;
				justify-content: space-between;

				span {
					text-transform: uppercase;
					font-size: var(--font-size-legal);
					font-weight: var(--font-weight-thin);
				}
			}

			.btn-add {
				margin: 8px 0;
				display: flex;
				align-items: center;
				gap: 8px;
			}
		}
	}
}
</style>
