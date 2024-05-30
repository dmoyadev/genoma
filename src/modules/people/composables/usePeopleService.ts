import { ref } from 'vue';
import type { Person } from '@/modules/people/models/Person.ts';
import { useDB } from '@/modules/app/composables/useDB.ts';

const people = ref<Record<string, Person>>({});
export function usePeopleService() {
	const { loading, getBy, upsert } = useDB('people');

	async function getPeople(force = false) {
		if (!force && Object.keys(people.value).length) {
			return;
		}

		people.value = {};

		// Fetch people from API
		const rawPeople = await getBy<Person>();

		people.value = rawPeople.reduce((acc, person) => {
			acc[person.id] = person;
			return acc;
		}, {} as Record<string, Person>);
	}

	async function upsertPerson(person: Partial<Person>) {
		const personRef = await upsert<Partial<Person>>(person, person.id);
		await getPeople(true);
		return personRef;
	}

	return {
		people,
		loading,
		getPeople,
		upsertPerson,
	};
}
