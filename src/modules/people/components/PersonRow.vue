<script setup lang="ts">
import { computed } from 'vue';
import type { Familiar, Person } from '@/modules/people/models/Person.ts';
import BaseAvatar from '@/components/avatar/BaseAvatar.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';

const props = defineProps<{ person: Familiar | Person }>();

function isFamiliar(person: Familiar | Person): person is Familiar {
	return 'data' in person;
}

const fullName = computed<string>(() => {
	if (isFamiliar(props.person)) {
		return `${props.person.data.name ? props.person.data.name : ''}
		${props.person.data.firstSurname ? ` ${props.person.data.firstSurname}` : ''}
		${props.person.data.secondSurname ? ` ${props.person.data.secondSurname}` : ''}`;
	}

	return `${props.person.name ? props.person.name : ''}
		${props.person.firstSurname ? ` ${props.person.firstSurname}` : ''}
		${props.person.secondSurname ? ` ${props.person.secondSurname}` : ''}`;
});
</script>

<template>
	<li @click="$router.push(`/people/${isFamiliar(person) ? person.data.id : person.id}`)">
		<BaseAvatar
			:alt="fullName"
			:size="40"
		/>

		<div class="info">
			<span class="name">{{ fullName }}</span>
			<small
				v-if="isFamiliar(person)"
				class="relation"
			>
				{{ person.relation }}
			</small>
		</div>

		<BaseIcon
			icon="mdi:chevron-right"
			:size="IconSize.L"
			class="icon-chevron"
		/>
	</li>
</template>

<style scoped lang="scss">
li {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px;
	width: 100%;

	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;

		.relation {
			text-transform: uppercase;
			font-weight: var(--font-weight-thin);
			color: var(--color-gray-4)
		}
	}

	.icon-chevron {
		margin-left: auto;
	}
}
</style>
