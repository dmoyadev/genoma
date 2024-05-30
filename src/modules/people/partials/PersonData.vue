<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import type { Gender, Person } from '@/modules/people/models/Person.ts';
import { RelationCode } from '@/modules/people/models/Person.ts';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { InputType } from '@/components/input/BaseInput.types.ts';
import BaseAvatar from '@/components/avatar/BaseAvatar.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import BaseRadioGroup from '@/components/radio/BaseRadioGroup.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';

defineProps<{
	formHasError?: boolean;
	loadingUpserting?: boolean;
}>();

const name = defineModel<string>('name');
const firstSurname = defineModel<string>('firstSurname');
const secondSurname = defineModel<string>('secondSurname');
const gender = defineModel<Gender>('gender');
const notes = defineModel<string>('notes');

const route = useRoute();

const relationString = computed<string>(() => {
	switch (route.query.relationCode) {
		case RelationCode.CHILD:
			return gender.value === 'female' ? 'una hija' : 'un hijo';
		case RelationCode.SPOUSE:
			return 'una pareja';
		case RelationCode.SIBLING:
			return gender.value === 'female' ? 'una hermana' : 'un hermano';
		case RelationCode.PARENT:
			return gender.value === 'female' ? 'una madre' : 'un padre';
		default:
			return 'un familiar';
	}
});

const { people } = usePeopleService();
const children = computed<Person[]>(() => {
	const childrenIDs = route.query.childrenIDs as string | undefined;
	if (!childrenIDs) {
		return [];
	}

	return childrenIDs.split(',').map(id => people.value[id]);
});

const relationFullName = computed<string>(() => {
	if (!route.query.id || !Object.keys(people.value).length) {
		return '';
	}

	const found = people.value[String(route.query.id)];
	if (route.query.relationCode === RelationCode.CHILD && route.query.spouseID) {
		const spouse = people.value[String(route.query.spouseID)];
		return `${found.name}
			${found.firstSurname ? ` ${found.firstSurname}` : ''}
			${found.secondSurname ? ` ${found.secondSurname}` : ''}
			y ${spouse.name}
			${spouse.firstSurname ? ` ${spouse.firstSurname}` : ''}
			${spouse.secondSurname ? ` ${spouse.secondSurname}` : ''}`;
	}

	if (route.query.relationCode === RelationCode.PARENT && route.query.spouseID) {
		const spouse = people.value[String(route.query.spouseID)];
		return `${found.name}
			${found.firstSurname ? ` ${found.firstSurname}` : ''}
			${found.secondSurname ? ` ${found.secondSurname}` : ''}, asociada a ${spouse.name}
			${spouse.firstSurname ? ` ${spouse.firstSurname}` : ''}
			${spouse.secondSurname ? ` ${spouse.secondSurname}` : ''}`;
	}

	if (children.value.length) {
		// Separate by comma and the last one with an ' y ' conjunction
		const childrenNames = children.value.map(child => child.name).join(', ').replace(/,(?=[^,]*$)/, ' y');
		return `${found.name}
		${found.firstSurname ? ` ${found.firstSurname}` : ''}
		${found.secondSurname ? ` ${found.secondSurname}` : ''},
		${found.gender === 'female' ? 'padre' : 'madre'} de ${childrenNames}`;
	}

	return `${found.name}
		${found.firstSurname ? ` ${found.firstSurname}` : ''}
		${found.secondSurname ? ` ${found.secondSurname}` : ''}`;
});

function getIconForGenderOption(option?: Gender): string {
	switch (option) {
		case 'male':
			return 'material-symbols:male';
		case 'female':
			return 'material-symbols:female';
		case 'unknown':
		default:
			return 'material-symbols:question-mark';
	}
}
</script>

<template>
	<form
		id="form"
		@submit.prevent
	>
		<p
			v-if="route.query.relationCode"
			class="msg-info"
		>
			<BaseIcon icon="mdi:information-outline" :size="IconSize.XL" />
			Se va a crear {{ relationString }} de {{ relationFullName }}.
		</p>

		<div class="avatar-and-name">
			<BaseAvatar
				:size="64"
				:alt="`Foto de ${name} ${firstSurname} ${secondSurname}`"
			/>

			<BaseInput
				v-model="name"
				:disabled="loadingUpserting"
			>
				Nombre
			</BaseInput>
		</div>

		<BaseInput
			v-model="firstSurname"
			:disabled="loadingUpserting"
		>
			Primer apellido
		</BaseInput>

		<BaseInput
			v-model="secondSurname"
			:disabled="loadingUpserting"
		>
			Segundo apellido
		</BaseInput>

		<BaseRadioGroup
			v-model="gender"
			:options="['male', 'female', 'unknown'] as Gender[]"
			required
			:has-error="formHasError && !gender"
			custom-validity="El género es obligatorio"
			:disabled="loadingUpserting"
		>
			<template #radio-label="{ option }">
				<BaseIcon
					:icon="getIconForGenderOption(option)"
					:size="IconSize.L"
				/>
			</template>
		</BaseRadioGroup>

		<BaseInput
			v-model="notes"
			:input-type="InputType.TEXTAREA"
			:disabled="loadingUpserting"
		>
			Anotaciones

			<template #helper>
				Añade notas adicionales sobre la persona, como su ocupación, dirección, o curiosidades.
			</template>
		</BaseInput>
	</form>
</template>

<style scoped lang="scss">
form {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.msg-info {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-primary);
	}

	.avatar-and-name {
		display: flex;
		align-items: center;
		gap: 16px;
	}
}
</style>
