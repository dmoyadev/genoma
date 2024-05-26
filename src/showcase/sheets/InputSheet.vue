<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputForm, InputType } from '@/components/input/BaseInput.types.ts';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';

const testText = ref('');
</script>

<template>
	<section class="sheet">
		<template
			v-for="form in InputForm"
			:key="form"
		>
			<ShowcaseElements>
				<template #title>
					Text input
				</template>

				<BaseInput
					v-model="testText"
					:form
					class="input"
				>
					{{ form }} input

					<template #append>
						<BaseIcon icon="mdi:car" />
					</template>

					<template #helper>
						<BaseIcon icon="mdi:check-circle-outline" :size="IconSize.S" />
						Did you know?
					</template>
				</BaseInput>

				<BaseInput
					v-model="testText"
					:form
					has-error
					class="input"
				>
					{{ form }} input

					<template #append>
						<BaseIcon icon="mdi:car" />
					</template>

					<template #error>
						<BaseIcon icon="mdi:warning-circle-outline" :size="IconSize.S" />
						There is an error
					</template>
				</BaseInput>

				<BaseInput
					v-model="testText"
					:form
					class="input"
					loading
				>
					{{ form }} input
				</BaseInput>
			</ShowcaseElements>

			<ShowcaseElements>
				<template #title>
					Other remarkable inputs
				</template>

				<BaseInput
					v-model="testText"
					:input-type="InputType.SEARCH"
					:form
					class="input"
				>
					Search input
				</BaseInput>

				<BaseInput
					v-model="testText"
					:form
					:input-type="InputType.PASSWORD"
					autocomplete="new-password"
					class="input"
				>
					Password input
				</BaseInput>
			</ShowcaseElements>

			<ShowcaseElements>
				<template #title>
					Textarea
				</template>

				<BaseInput
					v-model="testText"
					:form
					:input-type="InputType.TEXTAREA"
					class="input"
				>
					Textarea input

					<template #append>
						<BaseIcon icon="mdi:car" />
					</template>
				</BaseInput>
			</ShowcaseElements>
		</template>
	</section>
</template>

<style scoped lang="scss">
.sheet {
	padding: 16px 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	overflow-x: auto;
}

.input {
	width: 100%;
}
</style>
