import { ref } from 'vue';
import type { Person } from '@/modules/people/models/Person.ts';
import { useDB } from '@/modules/app/composables/useDB.ts';

const people = ref<Person[]>([]);
export function usePeopleService() {
	const { loading, getBy, upsert } = useDB('people');

	async function getPeople() {
		people.value = [];

		// Fetch people from API
		people.value = await getBy<Person>();
	}

	async function upsertPerson(person: Person) {
		const personRef = await upsert<Person>(person, person.id);
		await getPeople();
		return personRef;
	}

	if (!people.value.length) {
		void getPeople();
	}

	return {
		people,
		loading,
		getPeople,
		upsertPerson,
	};
}
