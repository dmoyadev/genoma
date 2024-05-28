<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/modules/auth/composables/useAuth.ts';
import router from '@/router.ts';
import AuthLayout from '@/layouts/AuthLayout.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm } from '@/components/button/BaseButton.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputForm, InputType } from '@/components/input/BaseInput.types.ts';
import * as pkg from '@/../package.json';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import { useStorage } from '@/modules/app/composables/useStorage.ts';

const { signInWithPassword } = useAuth();

const email = ref<string>('');
const password = ref<string>('');

// Manage the error state of the form
const triedSubmit = ref<boolean>(false);
watch(email, () => triedSubmit.value = false);
const isEmailValid = computed<boolean>(() => {
	return !triedSubmit.value
		|| (triedSubmit.value
		&& !!email.value
		&& /.[^\n\r@\u2028\u2029]*@.+\..+/.test(email.value));
});
watch(password, (value) => {
	if (!value) {
		errorLogin.value = false;
	}
});

const isEmailSet = ref<boolean>(false);

const { people, getPeople } = usePeopleService();
const hasSeenOnboarding = useStorage('onboarding-seen', false);

const loadingLogin = ref<boolean>(false);
const errorLogin = ref<boolean>(false);
const route = useRoute();
async function doSignIn() {
	errorLogin.value = false;
	loadingLogin.value = true;
	triedSubmit.value = true;

	if (!isEmailValid.value) {
		loadingLogin.value = false;
		return;
	}

	if (!password.value) {
		isEmailSet.value = true;
		loadingLogin.value = false;
		return;
	}

	signInWithPassword(email.value, password.value)
		.then(async () => {
			await getPeople();

			// If there is no people, redirect to onboarding
			if(!people.value.length && !hasSeenOnboarding.value) {
				await router.push('/onboarding');
				return;
			}

			// If there is a redirect query param, redirect to it
			if (route.query?.redirect) {
				await router.push(route.query.redirect as string);
				return;
			}

			await router.push('/');
		})
		.catch(() => errorLogin.value = true)
		.finally(() => loadingLogin.value = false);
}
</script>

<template>
	<AuthLayout>
		<h1>Guarda lo que más te importa</h1>
		<p>Gestiona tu propio árbol genealógico, desde lo más profundo.</p>

		<form @submit.prevent="doSignIn()">
			<BaseInput
				v-model="email"
				:input-type="InputType.EMAIL"
				:has-error="!isEmailValid || (triedSubmit && errorLogin)"
				:disabled="loadingLogin"
				autocomplete="username"
				required
			>
				Introduce tu email
				<template
					v-if="!isEmailValid"
					#error
				>
					Esto no es un email válido
				</template>
			</BaseInput>

			<section>
				<BaseInput
					v-model="password"
					:input-type="InputType.PASSWORD"
					:form="InputForm.NOTCHED_RIGHT"
					:has-error="triedSubmit && errorLogin"
					:disabled="loadingLogin"
					autocomplete="current-password"
					required
					autofocus
				>
					Introduce tu contraseña
					<template #error>
						Los datos de acceso no son válidos
					</template>
				</BaseInput>

				<BaseButton
					type="submit"
					:button-form="ButtonForm.CIRCLE"
					:color="(triedSubmit && errorLogin) ? ButtonColor.DANGER : ButtonColor.PRIMARY"
					:loading="loadingLogin"
					:disabled="!isEmailValid || loadingLogin"
				>
					<BaseIcon
						v-if="(triedSubmit && errorLogin)"
						icon="mdi:close"
					/>
					<BaseIcon
						v-else
						icon="mdi:arrow-right-thick"
						:size="IconSize.L"
					/>
				</BaseButton>
			</section>
		</form>

		<small>
			v.{{ pkg.version }}
			<br>
			Continuando, indicas que aceptas nuestros
			<a href="#">Términos y condiciones</a> y la <a href="#">Política de privacidad</a>
		</small>
	</AuthLayout>
</template>

<style lang="scss" scoped>
h1 {
	font-weight: bold;
	font-size: 18px;
	max-width: 265px;
}

p {
	font-size: var(--font-size-small);
	font-weight: 300;
	color: var(--color-primary);
}

form {
	margin-top: auto;
	margin-bottom: auto;
	display: flex;
	flex-direction: column;
	gap: 34px;

	section {
		display: flex;
		gap: 4px;
	}
}

small {
	margin-top: auto;
	align-self: center;
	display: block;
	font-size: var(--font-size-legal);
	color: var(--color-primary);
	text-align: center;
	max-width: 230px;

	a {
		color: var(--color-secondary-accent);
		font-size: var(--font-size-legal);
		text-decoration: underline;
	}
}
</style>