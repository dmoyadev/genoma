<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Person } from '@/modules/people/models/Person.ts';
import BaseAvatar from '@/components/avatar/BaseAvatar.vue';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';

const props = defineProps<{
	person: Person;
	x?: number;
	y?: number;
	generation?: number;
}>();

const fullName = computed(() => {
	return `${props.person.name ? props.person.name : ''}
	${props.person.firstSurname ? props.person.firstSurname : ''}
	${props.person.secondSurname ? props.person.secondSurname : ''}`;
});

const rendered = ref(false);
const currentX = ref<number>(0);
const currentY = ref<number>(0);
const CARD_WIDTH = 200;
const CARD_HEIGHT = 112;
onMounted(() => {
	if (!props.x || !props.y) {
		const middleX = (window.innerWidth / 2) - (CARD_WIDTH / 2);
		const middleY = (window.innerHeight) / 2 - (CARD_HEIGHT / 2);

		currentX.value = middleX;
		currentY.value = middleY;
	} else {
		currentX.value = props.x - (CARD_WIDTH / 2);
		currentY.value = props.y - (CARD_HEIGHT / 2);
	}

	rendered.value = true;
});

const { people } = usePeopleService();
const firstParent = computed<Person | undefined>(() => {
	if (!props.person?.relationships?.firstParentID) {
		return;
	}

	return people.value[props.person.relationships.firstParentID];
});
const secondParent = computed<Person | undefined>(() => {
	if (!props.person?.relationships?.secondParentID) {
		return;
	}

	return people.value[props.person.relationships.secondParentID];
});
</script>

<template>
	<!-- First parent -->
	<PersonCard
		v-if="rendered && firstParent"
		:person="firstParent"
		:x="currentX - 16"
		:y="currentY - (CARD_HEIGHT / 2) - 16"
		:generation="(generation || 0) - 1"
	/>

	<!-- Second parent -->
	<PersonCard
		v-if="rendered && secondParent"
		:person="secondParent"
		:x="currentX + CARD_WIDTH + 16"
		:y="currentY - (CARD_HEIGHT / 2) - 16"
		:generation="(generation || 0) - 1"
	/>

	<article class="person-card">
		<BaseAvatar :alt="fullName" />
		<h2>{{ fullName }}</h2>
	</article>

	<!-- Children -->
	<PersonCard
		v-if="rendered && firstParent"
		:person="firstParent"
		:x="currentX - 16"
		:y="currentY - (CARD_HEIGHT / 2) - 16"
		:generation="(generation || 0) - 1"
	/>
</template>

<style scoped lang="scss">
article {
	--person-card-width: v-bind('`${CARD_WIDTH}px`');
	--person-card-height: v-bind('`${CARD_HEIGHT}px`');

	position: absolute;
	left: v-bind('`${currentX}px`');
	top: v-bind('`${currentY}px`');

	min-width: var(--person-card-width);
	width: var(--person-card-width);
	max-width: var(--person-card-width);
	min-height: var(--person-card-height);
	height: var(--person-card-height);
	max-height: var(--person-card-height);

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 16px;
	padding: 16px;
	border: 1px solid var(--color-gray-6);
	border-radius: 8px;
}
</style>
