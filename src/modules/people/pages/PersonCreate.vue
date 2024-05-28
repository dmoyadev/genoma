<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
const { loading, people, createPerson } = usePeopleService();

const name = ref('');
const fatherName = ref('');
const motherName = ref('');
const gender = ref<Gender>();
const notes = ref('');

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
const loadingCreation = ref(false);
const errorCreation = ref<Error>();
function save() {
	loadingCreation.value = true;
	hasError.value = false;

	if (!name.value || !fatherName.value || !motherName.value || !gender.value) {
		hasError.value = true;
		loadingCreation.value = false;
		return;
	}

	const person: Person = {
		name: name.value,
		fatherName: fatherName.value,
		motherName: motherName.value,
		gender: gender.value,
		notes: notes.value,
	};

	createPerson(person)
		.then((response) => {
			if (response) {
				router.push(`/?created=${response.id}`);
				return;
			}

			errorCreation.value = new Error('No se ha podido crear la persona');
		})
		.catch((e: Error) => errorCreation.value = e)
		.finally(() => loadingCreation.value = false);
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
			title="Nueva persona"
			action-text="Guardar"
			:disable-action="loadingCreation"
			action-form="form"
			@click-action="save()"
		/>

		<main>
			<form
				id="form"
				@submit.prevent
			>
				<ErrorMessage v-if="hasError">
					Algo ha ido mal al crear la persona. Por favor, revisa los campos y vuelve a intentarlo.
					<br>
					Error: {{ errorCreation?.message }}
				</ErrorMessage>

				<div class="avatar-and-name">
					<BaseAvatar
						:size="64"
						:alt="`Foto de ${name} ${fatherName} ${motherName}`"
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
					v-model="fatherName"
					custom-validity="El apellido materno es obligatorio"
					:has-error="hasError && !fatherName"
					required
				>
					Apellido paterno
				</BaseInput>

				<BaseInput
					v-model="motherName"
					custom-validity="El apellido materno es obligatorio"
					:has-error="hasError && !motherName"
					required
				>
					Apellido materno
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
