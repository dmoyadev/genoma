import { Person } from '@/modules/people/models/Person.ts';
import { ref } from 'vue';
import { useDB } from '@/modules/app/composables/useDB.ts';

const people = ref<Person[]>([]);
export function usePeopleService() {
	const { getBy } = useDB('people');
	
	async function getPeople() {
		people.value = [];
		
		// Fetch people from API
		people.value = await getBy<Person>();
	}
	
	return {
		people,
		getPeople,
	}
}