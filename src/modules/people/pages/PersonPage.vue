<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import TheHeader from '@/modules/app/components/TheHeader.vue';
import type { Gender, Marriage, Person, Relationships } from '@/modules/people/models/Person.ts';
import { RelationCode } from '@/modules/people/models/Person.ts';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonMode } from '@/components/button/BaseButton.types.ts';
import PersonData from '@/modules/people/partials/PersonData.vue';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';
import BaseRadioGroup from '@/components/radio/BaseRadioGroup.vue';
import PersonRelations from '@/modules/people/partials/PersonRelations.vue';
import ErrorMessage from '@/modules/app/components/ErrorMessage.vue';

const router = useRouter();
const route = useRoute();
const ID = ref<string>(String(route.params.id));
const isCreating = computed(() => ID.value === '__new__');

const { loading, people, upsertPerson, getPeople } = usePeopleService();
getPeople();
const person = computed<Person | undefined>(() => people.value[ID.value]);

const fullName = computed<string>(() => {
	return `${person.value?.name ? person.value.name : ''}
	${person.value?.firstSurname ? ` ${person.value.firstSurname}` : ''}
	${person.value?.secondSurname ? ` ${person.value.secondSurname}` : ''}`;
});

const { root, relations } = useTreeService();
const isRoot = computed<boolean>(() => root.value?.id === person.value?.id);
function setAsRoot() {
	if (person.value) {
		relations.value = {};
		root.value = person.value;
	}
}

type TABS = 'data' | 'relationships';
const selectedTab = ref<TABS>((isCreating.value ? 'data' : (route.query.tab as TABS | undefined) || 'data'));
function updateTabQueryParam(tab: TABS) {
	const queryParams = Object.entries(route.query)
		.filter(p => p[0] !== 'tab')
		.map(p => `${p[0]}=${p[1]}`)
		.join('&');
	// use history.replaceState to avoid page reload, but don't lose the query params
	history.replaceState({}, '', `?${queryParams}${queryParams ? '&' : ''}tab=${tab}`);
}

const name = ref<string>();
const firstSurname = ref<string | undefined>(route.query.firstSurname as string | undefined);
const secondSurname = ref<string | undefined>(route.query.secondSurname as string | undefined);
const gender = ref<Gender>();
const notes = ref<string>();

watchEffect(() => {
	if (person.value) {
		const fullName = `${person.value.name ? person.value.name : ''}
		${person.value.firstSurname ? ` ${person.value.firstSurname}` : ''}
		${person.value.secondSurname ? ` ${person.value.secondSurname}` : ''}`;
		if (document.title.includes('Nueva persona')) {
			document.title = document.title.replace('Nueva persona', fullName);
		} else {
			document.title = document.title.replace('{id}', fullName);
		}

		name.value = person.value.name;
		firstSurname.value = person.value.firstSurname;
		secondSurname.value = person.value.secondSurname;
		gender.value = person.value.gender;
		notes.value = person.value.notes;
	} else {
		document.title = document.title.replace('{id}', 'Nueva persona');
	}
});

function getRelationship(): Relationships {
	const relationships = { ...person.value?.relationships };

	if (!isCreating.value) {
		return relationships;
	}

	const relatedID = String(route.query.id);
	const related = people.value[relatedID];
	if (!relatedID || !related) {
		return relationships;
	}

	switch (String(route.query.relationCode)) {
		case RelationCode.PARENT: {
			const spouseID = String(route.query.spouseID);
			const newMarriage: Marriage = {
				...(spouseID && { spouseID }),
				active: true,
				childrenIDs: related.relationships.siblingsIDs
					? [...related.relationships.siblingsIDs, relatedID]
					: [relatedID],
			};

			relationships.marriages = [
				...(relationships.marriages || []),
				newMarriage,
			];

			break;
		}

		case RelationCode.SIBLING:
			if (relationships.siblingsIDs?.length) {
				if (!relationships.siblingsIDs?.includes(relatedID)) {
					relationships.siblingsIDs.push(relatedID);
				}
			} else {
				relationships.siblingsIDs = [relatedID];
			}

			if (related.relationships.firstParentID) {
				relationships.firstParentID = related.relationships.firstParentID;
			}

			if (related.relationships.secondParentID) {
				relationships.secondParentID = related.relationships.secondParentID;
			}
			break;

		case RelationCode.SPOUSE: {
			const childrenIDs = String(route.query.childrenIDs)?.split(',') || [];
			if (!childrenIDs.length) {
				relationships.marriages = [
					...(relationships.marriages || []),
					{
						spouseID: relatedID,
						active: true,
						childrenIDs: [],
					},
				];
				break;
			}

			const marriage = related.relationships?.marriages?.find(m => m.childrenIDs?.includes(childrenIDs[0]));
			if (marriage) {
				relationships.marriages = [
					...(relationships.marriages || []),
					{
						spouseID: relatedID,
						active: true,
						childrenIDs: [...marriage.childrenIDs!],
					},
				];
			}
			break;
		}

		case RelationCode.CHILD:
			if (!relationships.firstParentID) {
				if (related.gender === 'male') {
					relationships.firstParentID = relatedID;
					if (route.query.spouseID) {
						relationships.secondParentID = String(route.query.spouseID);
					}
				} else {
					relationships.secondParentID = relatedID;
					if (route.query.spouseID) {
						relationships.firstParentID = String(route.query.spouseID);
					}
				}
			} else {
				relationships.secondParentID = relatedID;
			}
			break;

		default:
			break;
	}

	return relationships;
}

const hasError = ref(false);
const loadingUpserting = ref(false);
const errorUpserting = ref<Error>();
async function save() {
	loadingUpserting.value = true;
	hasError.value = false;

	if (!gender.value) {
		hasError.value = true;
		loadingUpserting.value = false;
		return;
	}

	const personData: Partial<Person> = {
		...person.value,
		...(name.value && { name: name.value }),
		...(firstSurname.value && { firstSurname: firstSurname.value }),
		...(secondSurname.value && { secondSurname: secondSurname.value }),
		gender: gender.value,
		relationships: getRelationship(),
		...(notes.value && { notes: notes.value }),
	};

	try {
		const upsertedPerson = await upsertPerson(personData);

		if (!upsertedPerson) {
			throw new Error('No se ha podido guardar la persona');
		}

		const relatedID = String(route.query.id);
		const related: Person = people.value[relatedID];
		if (related && upsertedPerson.id) {
			switch (String(route.query.relationCode)) {
				case RelationCode.PARENT: {
					// We have to update the child to add the parent
					await upsertPerson({
						id: relatedID,
						relationships: {
							...related.relationships,
							...(related.relationships.firstParentID
								? { secondParentID: upsertedPerson.id }
								: { firstParentID: upsertedPerson.id }
							),
						},
					});

					// We have to update the spouse if it has to add the marriage with the parent
					const spouseID = related.relationships.firstParentID || related.relationships.secondParentID;
					if (spouseID) {
						await upsertPerson({
							id: spouseID,
							relationships: {
								...people.value[spouseID].relationships,
								marriages: [
									...(people.value[spouseID].relationships.marriages || []).map((m) => {
										if (m.childrenIDs?.includes(relatedID)) {
											return {
												...m,
												spouseID: upsertedPerson.id,
											};
										}

										return m;
									}),
								],
							},
						});
					}

					// We also have to update the siblings to add the parent
					if (related.relationships.siblingsIDs) {
						await Promise.all(related.relationships.siblingsIDs?.map(async (siblingID) => {
							const sibling = people.value[siblingID];
							await upsertPerson({
								id: sibling.id,
								relationships: {
									...sibling.relationships,
									...(sibling.relationships.firstParentID
										? { secondParentID: upsertedPerson.id }
										: { firstParentID: upsertedPerson.id }
									),
								},
							});
						}));
					}
					break;
				}

				case RelationCode.SIBLING: {
					// We have to update the parents to add the child
					if (related.relationships.firstParentID) {
						const firstParent = people.value[related.relationships.firstParentID];
						await upsertPerson({
							id: firstParent.id,
							relationships: {
								...firstParent.relationships,
								marriages: [
									...(firstParent.relationships.marriages || []).map((m) => {
										if (m.childrenIDs?.includes(relatedID)) {
											return {
												...m,
												childrenIDs: m.childrenIDs ? [...m.childrenIDs, upsertedPerson.id] : [upsertedPerson.id],
											};
										}

										return m;
									}),
								],
							},
						});
					}

					if (related.relationships.secondParentID) {
						const secondParent = people.value[related.relationships.secondParentID];
						await upsertPerson({
							id: secondParent.id,
							relationships: {
								...secondParent.relationships,
								marriages: [
									...(secondParent.relationships.marriages || []).map((m) => {
										if (m.childrenIDs?.includes(relatedID)) {
											return {
												...m,
												childrenIDs: m.childrenIDs ? [...m.childrenIDs, upsertedPerson.id] : [upsertedPerson.id],
											};
										}

										return m;
									}),
								],
							},
						});
					}

					// Now we update all the siblings to add the new sibling
					if (related.relationships.siblingsIDs) {
						await Promise.all(related.relationships.siblingsIDs.map(async (siblingID) => {
							const sibling = people.value[siblingID];
							await upsertPerson({
								id: sibling.id,
								relationships: {
									...sibling.relationships,
									siblingsIDs: sibling.relationships.siblingsIDs
										? [...sibling.relationships.siblingsIDs, upsertedPerson.id]
										: [upsertedPerson.id],
								},
							});
						}));
					} else {
						await upsertPerson({
							id: relatedID,
							relationships: {
								...related.relationships,
								siblingsIDs: [upsertedPerson.id],
							},
						});
					}
					break;
				}

				case RelationCode.SPOUSE:
					const childrenIDs = String(route.query.childrenIDs)?.split(',') || [];
					if (!childrenIDs.length) {
						// As there are no children, we only update the spouse to create a marriage with spouseID
						await upsertPerson({
							id: relatedID,
							relationships: {
								...related.relationships,
								marriages: [
									...(related.relationships?.marriages || []),
									{
										spouseID: upsertedPerson.id,
										active: true,
										childrenIDs: [],
									},
								],
							},
						});
						break;
					}

					// First we update the spouse to add the marriage spouseID
					await upsertPerson({
						id: relatedID,
						relationships: {
							...related.relationships,
							marriages: [
								...(related.relationships?.marriages?.map((m) => {
									if (!m.childrenIDs?.some(c => childrenIDs.includes(c))) {
										return m;
									}

									return {
										...m,
										spouseID: upsertedPerson.id,
									};
								}) || []),
							],
						},
					});

					// Then we update the children to add the second parent
					await Promise.all(childrenIDs.map(async (childID) => {
						const child = people.value[childID];
						await upsertPerson({
							id: childID,
							relationships: {
								...child.relationships,
								secondParentID: upsertedPerson.id,
							},
						});
					}));
					break;

				case RelationCode.CHILD: {
					const spouseID = String(route.query.spouseID);
					const spouse = people.value[spouseID];

					if (!spouse) {
						// As there are no spouse, we only update the parent to add the child
						await upsertPerson({
							id: relatedID,
							relationships: {
								...related.relationships,
								marriages: [
									...(related.relationships?.marriages || []),
									{
										childrenIDs: [upsertedPerson.id],
									},
								],
							},
						});
						break;
					}

					// First we update the parent to add the child
					await upsertPerson({
						id: relatedID,
						relationships: {
							...related.relationships,
							marriages: [
								...(related.relationships?.marriages?.map((m) => {
									if (m.spouseID !== spouseID) {
										return m;
									}

									return {
										...m,
										childrenIDs: m.childrenIDs ? [...m.childrenIDs, upsertedPerson.id] : [upsertedPerson.id],
									};
								}) || []),
							],
						},
					});

					// Then we update the spouse to add the child
					await upsertPerson({
						id: spouseID,
						relationships: {
							...spouse.relationships,
							marriages: [
								...(spouse.relationships?.marriages?.map((m) => {
									if (m.spouseID !== relatedID) {
										return m;
									}

									return {
										...m,
										childrenIDs: m.childrenIDs ? [...m.childrenIDs, upsertedPerson.id] : [upsertedPerson.id],
									};
								}) || []),
							],
						},
					});
					break;
				}

				default:
					break;
			}
		}

		if (isCreating.value) {
			if (route.query.id) {
				await router.push(`/people/${route.query.id}?tab=relationships&created=${upsertedPerson.id}`);
			} else {
				await router.push(`/?created=${upsertedPerson.id}`);
			}
		} else {
			await router.push(`/?updated=${upsertedPerson.id}`);
		}
	} catch (e: unknown) {
		errorUpserting.value = e as Error;
	}

	loadingUpserting.value = false;
}
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

	<!-- ✅ Loaded state -->
	<template v-if="!loading">
		<TheHeader
			:disallow-back="!Object.keys(people).length"
			:title="isCreating ? 'Nueva persona' : fullName"
			action-text="Guardar"
			:disable-action="loadingUpserting"
			action-form="form"
			@click-action="save()"
		/>

		<nav v-if="!isCreating">
			<BaseRadioGroup
				v-model="selectedTab"
				:options="['data', 'relationships']"
				@update:model-value="updateTabQueryParam($event as TABS)"
			>
				<template #radio-label="{ option }">
					<div class="radio-label">
						<BaseIcon
							:icon="option === 'data' ? 'mdi:account' : 'mdi:account-group'"
							:size="IconSize.L"
						/>
						{{ option === 'data' ? 'Datos' : 'Relaciones' }}
					</div>
				</template>
			</BaseRadioGroup>
		</nav>

		<main>
			<ErrorMessage v-if="errorUpserting">
				Algo ha ido mal al guardar la persona. Por favor, revisa los campos y vuelve a intentarlo.
				<br>
				Error: {{ errorUpserting?.message }}
			</ErrorMessage>

			<PersonData
				v-if="selectedTab === 'data'"
				:key="ID"
				v-model:name="name"
				v-model:firstSurname="firstSurname"
				v-model:secondSurname="secondSurname"
				v-model:gender="gender"
				v-model:notes="notes"
				:form-has-error="hasError"
			/>

			<PersonRelations
				v-else-if="selectedTab === 'relationships' && person"
				:person
			/>

			<BaseButton
				v-if="!loading && !isCreating"
				:mode="ButtonMode.OUTLINE"
				:disabled="loadingUpserting || isRoot"
				@click="setAsRoot()"
			>
				{{ isRoot
					? 'Esta persona ya es la selección principal'
					: 'Establecer como selección para el árbol' }}
			</BaseButton>
		</main>
	</template>
</template>

<style scoped lang="scss">
.icon-loading {
	margin: auto;
}

nav {
	padding: 0 16px;
	margin-bottom: 16px;
	.radio-label {
		display: flex;
		align-items: center;
		gap: 8px;
	}
}

main {
	flex: 1;
	padding: 0 16px 16px;
	display: flex;
	flex-direction: column;
	gap: 32px;
}
</style>
