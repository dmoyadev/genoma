import { ref } from 'vue';
import type { Person } from '@/modules/people/models/Person.ts';

const root = ref<Person>();
const alreadyPaintedPeople = ref<Record<string, Person>>({});
export function useTreeService() {
	return {
		root,
		alreadyPaintedPeople,
	};
}
