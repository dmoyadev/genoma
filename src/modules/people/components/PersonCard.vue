<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import type { Person } from '@/modules/people/models/Person.ts';
import BaseAvatar from '@/components/avatar/BaseAvatar.vue';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';

const props = defineProps<{
	person: Person; /* The person to display */
	generation: number; /* The number of levels from the root */
}>();

const fullName = computed(() =>
	`${props.person.name}
	${props.person.firstSurname ? ` ${props.person.firstSurname}` : ''}
	${props.person.secondSurname ? ` ${props.person.secondSurname}` : ''}`,
);

const loadingRender = ref(true);
onMounted(() => {
	loadingRender.value = false;
});

const { people } = usePeopleService();
const { root, alreadyPaintedPeople } = useTreeService();
alreadyPaintedPeople.value[props.person.id!] = props.person;

const firstParent = ref<Person>();
const secondParent = ref<Person>();
const siblings = ref<Person[]>([]);
const marriages = ref<[Person | undefined, Person[]][]>([]);
onBeforeMount(() => {
	function findPerson(id?: string): Person | undefined {
		if (!id) {
			return;
		}

		const found = people.value.find(person => person.id === id && !alreadyPaintedPeople.value[person.id!]);
		if (!found) {
			return;
		}

		alreadyPaintedPeople.value[found.id!] = found;
		return found;
	}

	function findPeopleInArray(ids?: string[]): Person[] {
		if (!ids) {
			return [];
		}
		const found = people.value.filter(person => ids.includes(person.id!) && !alreadyPaintedPeople.value[person.id!]);
		found.forEach((person) => {
			alreadyPaintedPeople.value[person.id!] = person;
		});
		return found;
	}

	firstParent.value = findPerson(props.person.relationships.firstParentID);
	secondParent.value = findPerson(props.person.relationships.secondParentID);
	siblings.value = findPeopleInArray(props.person.relationships.siblingsIDs);
	marriages.value = props.person.relationships.marriages
		?.map(marriage => [findPerson(marriage.spouseID), findPeopleInArray(marriage.childrenIDs)])
		|| [];
});

function changeRoot(person: Person) {
	alreadyPaintedPeople.value = {};
	root.value = person;
}
</script>

<template>
	<div class="family">
		<!-- Parents -->
		<div
			v-if="!loadingRender && (firstParent || secondParent) && generation === 0"
			class="predecessors"
		>
			<PersonCard
				v-if="firstParent"
				:person="firstParent"
				:generation="generation - 1"
				class="card-first-parent"
				@click="changeRoot(firstParent)"
			/>

			<PersonCard
				v-if="secondParent"
				:person="secondParent"
				:generation="generation - 1"
				class="card-second-parent"
				@click="changeRoot(secondParent)"
			/>
		</div>

		<div class="same-generation">
			<!-- Actual person -->
			<article
				ref="$card"
				v-bind="$attrs"
				:style="{
					'--generation': generation,
				}"
			>
				<BaseAvatar
					:alt="`Foto de ${fullName}`"
					:size="40"
				/>
				<h2>{{ fullName }}</h2>
			</article>

			<!-- Marriages -->
			<div
				v-for="(marriage, index) in marriages"
				:key="index"
				class="family-unit"
			>
				<!-- Spouse -->
				<PersonCard
					v-if="marriage[0]"
					:person="marriage[0]"
					:generation="generation"
					class="card-spouse"
					@click="changeRoot(marriage[0])"
				/>

				<div class="successors">
					<!-- Children -->
					<PersonCard
						v-for="child in marriage[1]"
						:key="child.id"
						:person="child"
						:generation="generation + 1"
						class="card-child"
						@click="changeRoot(child)"
					/>
				</div>
			</div>

			<!-- Siblings -->
			<PersonCard
				v-for="sibling in siblings"
				:key="sibling.id"
				:person="sibling"
				:generation="generation"
				class="card-sibling"
				@click="changeRoot(sibling)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	article {
		padding: 8px 16px;
		border-radius: 8px;
		border: 1px solid var(--color-gray-2);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
		order: var(--generation);
	}

	.family {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;

		.predecessors {
			display: flex;
			align-items: flex-end;
			gap: 16px;
		}

		.same-generation {
			display: flex;
			align-items: flex-start;
			gap: 16px;

			.family-unit {
				display: flex;
				flex-direction: column;
				gap: 16px;

				.successors {
					display: flex;
					gap: 16px;
				}
			}
		}
	}
</style>
