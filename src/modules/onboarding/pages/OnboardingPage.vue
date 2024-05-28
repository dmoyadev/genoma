<script setup lang="ts">
import { computed, ref } from 'vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import BaseStepper from '@/components/stepper/BaseStepper.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';

const currentStep = ref(1);

const stepTitle = computed<string | undefined>(() => {
	switch (currentStep.value) {
		case 1:
			return 'Bienvenido a Genoma';
		case 2:
			return 'Genoma guarda tus datos en la nube';
		case 3:
		default:
	}
});

const stepText = computed<string>(() => {
	switch (currentStep.value) {
		case 1:
			return 'La aplicación donde guardar lo más importante: tu familia. En Genoma podrás almacenar la información de tu árbol genealógico hasta lo más profundo. ¿Estás listo?';
		case 2:
			return 'Así puedes acceder a ellos desde cualquier lugar y en todo momento. ¿Esa conversación con tu madre? Ahora podrás guardar los detalles de su abuelo que te contó.';
		case 3:
			return 'Vamos a empezar por crear al centro de tu árbol genealógico. ¡Tú!';
		default:
			return '';
	}
});
</script>

<template>
	<OnboardingLayout>
		<main>
			<img
				:src="`/onboarding/onboarding-${currentStep}.svg`"
				alt=""
			>

			<h1 v-if="stepTitle">
				{{ stepTitle }}
			</h1>

			<p>
				{{ stepText }}
			</p>

			<section class="actions">
				<BaseButton
					v-if="currentStep > 1"
					type="button"
					:button-form="ButtonForm.CIRCLE"
					:mode="ButtonMode.OUTLINE"
					@click="currentStep--"
				>
					<BaseIcon icon="mdi:arrow-left" />
				</BaseButton>
				<BaseButton
					:button-form="currentStep !== 1 ? ButtonForm.NOTCHED_LEFT : ButtonForm.BLOCK"
					:to="currentStep === 3 ? '/people/__new__' : undefined"
					@click="currentStep++"
				>
					{{ currentStep === 3 ? 'Empezar' : 'Siguiente' }}
				</BaseButton>
			</section>

			<BaseStepper
				:total="3"
				:current="currentStep"
			/>
		</main>
	</OnboardingLayout>
</template>

<style scoped lang="scss">
main {
	width: 100%;
	flex: 1;
	padding: 0 32px 32px ;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;

	h1 {
		align-self: flex-start;
		font-size: var(--font-size-title);
	}

	img {
		flex: 1;
		height: 100%;
	}

	p {
		color: var(--color-primary);
	}

	.actions {
		margin: 16px 0;
		width: 100%;
		display: flex;
		align-items: center;
	}
}
</style>
