<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import TheHeader from '@/modules/app/components/TheHeader.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/BaseInput.types.ts';
import BaseAvatar from '@/components/avatar/BaseAvatar.vue';
import BaseRadioGroup from '@/components/radio/BaseRadioGroup.vue';
import type { Gender, Person } from '@/modules/people/models/Person.ts';
import ErrorMessage from '@/modules/app/components/ErrorMessage.vue';

const router = useRouter();
const route = useRoute();
const ID = ref(route.params.id);
const isCreating = computed(() => ID.value === '__new__');

const { loading, people, upsertPerson } = usePeopleService();
const person = computed(() => people.value.find(p => p.id === ID.value));

const name = ref<string>();
const firstSurname = ref<string>();
const secondSurname = ref<string>();
const gender = ref<Gender>();
const notes = ref<string>();

watchEffect(() => {
	if (person.value) {
		const fullName = `${person.value.name} ${person.value.firstSurname} ${person.value.secondSurname}`;
		document.title = document.title.replace('{id}', fullName);

		name.value = person.value.name;
		firstSurname.value = person.value.firstSurname;
		secondSurname.value = person.value.secondSurname;
		gender.value = person.value.gender;
		notes.value = person.value.notes;
	} else {
		document.title = document.title.replace('{id}', 'Nueva persona');
	}
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

const hasError = ref(false);
const loadingUpserting = ref(false);
const errorUpserting = ref<Error>();
function save() {
	loadingUpserting.value = true;
	hasError.value = false;

	if (!name.value || !firstSurname.value || !secondSurname.value || !gender.value) {
		hasError.value = true;
		loadingUpserting.value = false;
		return;
	}

	const newPersonData: Person = {
		...person.value,
		name: name.value,
		firstSurname: firstSurname.value,
		secondSurname: secondSurname.value,
		gender: gender.value,
		...(notes.value && { notes: notes.value }),
	};

	upsertPerson(newPersonData)
		.then((response) => {
			if (response) {
				if (isCreating.value) {
					router.push(`/?created=${response.id}`);
				} else {
					router.push(`/?updated=${response.id}`);
				}
				return;
			}

			errorUpserting.value = new Error('No se ha podido guardar la persona');
		})
		.catch((e: Error) => errorUpserting.value = e)
		.finally(() => loadingUpserting.value = false);
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
			:disallow-back="!people.length"
			:title="isCreating ? 'Nueva persona' : 'Editar persona'"
			action-text="Guardar"
			:disable-action="loadingUpserting"
			action-form="form"
			@click-action="save()"
		/>

		<main>
			<form
				id="form"
				@submit.prevent
			>
				<ErrorMessage v-if="errorUpserting">
					Algo ha ido mal al guardar la persona. Por favor, revisa los campos y vuelve a intentarlo.
					<br>
					Error: {{ errorUpserting?.message }}
				</ErrorMessage>

				<div class="avatar-and-name">
					<BaseAvatar
						:size="64"
						:alt="`Foto de ${name} ${firstSurname} ${secondSurname}`"
					/>

					<BaseInput
						v-model="name"
						custom-validity="El nombre es obligatorio"
						:has-error="hasError && !name"
						required
					>
						Nombre
					</BaseInput>
				</div>

				<BaseInput
					v-model="firstSurname"
					custom-validity="El apellido materno es obligatorio"
					:has-error="hasError && !firstSurname"
					required
				>
					Primer apellido
				</BaseInput>

				<BaseInput
					v-model="secondSurname"
					custom-validity="El apellido materno es obligatorio"
					:has-error="hasError && !secondSurname"
					required
				>
					Segundo apellido
				</BaseInput>

				<BaseRadioGroup
					v-model="gender"
					:options="['male', 'female', 'unknown'] as Gender[]"
					required
					:has-error="hasError && !gender"
					custom-validity="El género es obligatorio"
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
				>
					Anotaciones

					<template #helper>
						Añade notas adicionales sobre la persona, como su ocupación, dirección, o curiosidades.
					</template>
				</BaseInput>
			</form>
		</main>
	</template>
</template>

<style scoped lang="scss">
.icon-loading {
	margin: auto;
}

main {
	flex: 1;
	padding: 0 16px 16px;

	form {
		display: flex;
		flex-direction: column;
		gap: 16px;

		.avatar-and-name {
			display: flex;
			align-items: center;
			gap: 16px;
		}
	}
}
</style>
