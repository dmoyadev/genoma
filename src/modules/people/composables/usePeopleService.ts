import { ref } from 'vue';
import type { Person } from '@/modules/people/models/Person.ts';
import { useDB } from '@/modules/app/composables/useDB.ts';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';

const people = ref<Record<string, Person>>({});
export function usePeopleService() {
	const { loading, getBy, upsert } = useDB('people');

	async function getPeople(force = false) {
		if (!force && Object.keys(people.value).length) {
			return;
		}

		people.value = {};
		const { root } = useTreeService();
		root.value = undefined;

		// TODO
		const rawPeople = [
			{
				name: 'Daniel',
				firstSurname: 'Moya',
				secondSurname: 'Leiva',
				gender: 'male',
				id: 'dani',
				relationships: {
					firstParentID: 'papá',
					secondParentID: 'mamá',
					siblingsIDs: ['hermana'],
					marriages: [
						{
							spouseID: 'cris',
							active: true,
							childrenIDs: ['hijo', 'hija'],
						},
						{
							spouseID: 'otra',
							active: false,
						},
						{
							active: false,
							childrenIDs: ['bastardo', 'bastarda', 'bastarde'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Bastardo',
				firstSurname: 'Nieve',
				secondSurname: 'Arena',
				gender: 'male',
				id: 'bastardo',
				relationships: {
					firstParentID: 'dani',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Bastarda',
				firstSurname: 'Nieve',
				secondSurname: 'Arena',
				gender: 'female',
				id: 'bastarda',
				relationships: {
					firstParentID: 'dani',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Bastarde',
				firstSurname: 'Nieve',
				secondSurname: 'Arena',
				gender: 'unknown',
				id: 'bastarde',
				relationships: {
					firstParentID: 'dani',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Daniel',
				firstSurname: 'Moya',
				secondSurname: 'López',
				gender: 'male',
				id: 'papá',
				relationships: {
					firstParentID: 'abuelo2',
					secondParentID: 'abuela2',
					marriages: [
						{
							spouseID: 'mamá',
							active: true,
							childrenIDs: ['dani', 'hermana'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Ana',
				firstSurname: 'Leiva',
				secondSurname: 'Montes',
				gender: 'female',
				id: 'mamá',
				relationships: {
					firstParentID: 'abuelo',
					secondParentID: 'abuela',
					siblingsIDs: ['tito', 'tita'],
					marriages: [
						{
							spouseID: 'papá',
							active: true,
							childrenIDs: ['dani', 'hermana'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Facundo',
				firstSurname: 'Leiva',
				secondSurname: 'Martínez',
				gender: 'male',
				id: 'abuelo',
				relationships: {
					marriages: [
						{
							spouseID: 'abuela',
							active: true,
							childrenIDs: ['mamá', 'tita', 'tito'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Maria Jesús',
				firstSurname: 'Montes',
				secondSurname: 'García',
				gender: 'female',
				id: 'abuela',
				relationships: {
					marriages: [
						{
							spouseID: 'abuelo',
							active: true,
							childrenIDs: ['mamá', 'tita', 'tito'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Juan Antonio',
				firstSurname: 'Leiva',
				secondSurname: 'Montes',
				gender: 'male',
				id: 'tito',
				relationships: {
					firstParentID: 'abuelo',
					secondParentID: 'abuela',
					siblingsIDs: ['mamá', 'tita'],
					marriages: [
						{
							spouseID: 'mcarmen',
							active: true,
							childrenIDs: ['jesus'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'MCarmen',
				firstSurname: 'Galiano',
				gender: 'female',
				id: 'mcarmen',
				relationships: {
					marriages: [
						{
							spouseID: 'tito',
							active: true,
							childrenIDs: ['jesus'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Jesús',
				firstSurname: 'Leiva',
				secondSurname: 'Galiano',
				gender: 'male',
				id: 'jesus',
				relationships: {
					firstParentID: 'tito',
					secondParentID: 'mcarmen',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Pilar',
				firstSurname: 'Leiva',
				secondSurname: 'Montes',
				gender: 'female',
				id: 'tita',
				relationships: {
					firstParentID: 'abuelo',
					secondParentID: 'abuela',
					siblingsIDs: ['mamá', 'tito'],
					marriages: [
						{
							active: false,
							childrenIDs: ['sandra'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Sandra',
				firstSurname: 'Luque',
				secondSurname: 'Leiva',
				gender: 'female',
				id: 'sandra',
				relationships: {
					secondParentID: 'tita',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Alberto',
				firstSurname: 'Moya',
				secondSurname: 'Coca',
				gender: 'male',
				id: 'abuelo2',
				relationships: {
					firstParentID: 'bisabuelo',
					secondParentID: 'bisabuela',
					marriages: [
						{
							spouseID: 'abuela2',
							active: true,
							childrenIDs: ['papá'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Bisabuelo',
				firstSurname: 'Primero',
				gender: 'male',
				id: 'bisabuelo',
				relationships: {
					firstParentID: 'tatarabuelo',
					secondParentID: 'tatarabuela',
					marriages: [
						{
							spouseID: 'bisabuela',
							active: true,
							childrenIDs: ['abuelo2'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Bisabuela',
				firstSurname: 'Primera',
				gender: 'female',
				id: 'bisabuela',
				relationships: {
					marriages: [
						{
							spouseID: 'bisabuelo',
							active: true,
							childrenIDs: ['abuelo2'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Tatarabuelo',
				firstSurname: 'Primero',
				gender: 'male',
				id: 'tatarabuelo',
				relationships: {
					firstParentID: 'tastatarabuelo',
					secondParentID: 'tastatarabuela',
					marriages: [
						{
							spouseID: 'tatarabuela',
							active: true,
							childrenIDs: ['bisabuelo'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Tatarabuela',
				firstSurname: 'Primera',
				gender: 'female',
				id: 'tatarabuela',
				relationships: {
					marriages: [
						{
							spouseID: 'tatarabuelo',
							active: true,
							childrenIDs: ['bisabuelo'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Tastatarabuelo',
				firstSurname: 'Primero',
				gender: 'male',
				id: 'tastatarabuelo',
				relationships: {
					firstParentID: 'padre de tastatarabuelo',
					secondParentID: 'madre de tastatarabuela',
					marriages: [
						{
							spouseID: 'tastatarabuela',
							active: true,
							childrenIDs: ['tatarabuelo'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Tastatarabuela',
				firstSurname: 'Primera',
				gender: 'female',
				id: 'tastatarabuela',
				relationships: {
					marriages: [
						{
							spouseID: 'tastatarabuelo',
							active: true,
							childrenIDs: ['tatarabuelo'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Padre de Tastatarabuelo',
				firstSurname: 'Primero',
				gender: 'male',
				id: 'padre de tastatarabuelo',
				relationships: {
					marriages: [
						{
							spouseID: 'madre de tastatarabuela',
							active: true,
							childrenIDs: ['tastatarabuelo'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Madre de Tastatarabuela',
				firstSurname: 'Primera',
				gender: 'female',
				id: 'madre de tastatarabuela',
				relationships: {
					marriages: [
						{
							spouseID: 'padre de tastatarabuelo',
							active: true,
							childrenIDs: ['tastatarabuelo'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'María José',
				firstSurname: 'López',
				secondSurname: 'Armenteros',
				gender: 'female',
				id: 'abuela2',
				relationships: {
					marriages: [
						{
							spouseID: 'abuelo2',
							active: true,
							childrenIDs: ['abuela'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Ana',
				firstSurname: 'Moya',
				secondSurname: 'Leiva',
				gender: 'female',
				id: 'hermana',
				relationships: {
					firstParentID: 'papá',
					secondParentID: 'mamá',
					siblingsIDs: ['dani'],
					marriages: [
						{
							active: false,
							childrenIDs: ['sobrino'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Sobrino',
				firstSurname: 'Primero',
				gender: 'male',
				id: 'sobrino',
				relationships: {
					firstParentID: 'hermana',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Cristina',
				firstSurname: 'Guerrero',
				secondSurname: 'Ortega',
				gender: 'female',
				id: 'cris',
				relationships: {
					marriages: [
						{
							spouseID: 'dani',
							active: true,
							childrenIDs: ['hijo', 'hija'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'La Otra',
				gender: 'female',
				id: 'otra',
				relationships: {
					marriages: [
						{
							spouseID: 'dani',
							active: false,
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Hijo 1',
				firstSurname: 'Moya',
				gender: 'male',
				secondSurname: 'Guerrero',
				id: 'hijo',
				relationships: {
					firstParentID: 'dani',
					secondParentID: 'cris',
					marriages: [
						{
							active: false,
							childrenIDs: ['nieto'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Nieto 1',
				firstSurname: 'Moya',
				gender: 'male',
				id: 'nieto',
				relationships: {
					firstParentID: 'hijo',
					marriages: [
						{
							active: false,
							childrenIDs: ['bisnieto'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Bisnieto 1',
				firstSurname: 'Moya',
				gender: 'male',
				id: 'bisnieto',
				relationships: {
					firstParentID: 'nieto',
					marriages: [
						{
							active: false,
							childrenIDs: ['tataranieto'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Tataranieto 1',
				firstSurname: 'Moya',
				gender: 'male',
				id: 'tataranieto',
				relationships: {
					firstParentID: 'bisnieto',
					marriages: [
						{
							active: false,
							childrenIDs: ['tastataranieto'],
						},
					],
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Tastataranieto 1',
				firstSurname: 'Moya',
				gender: 'male',
				secondSurname: 'Guerrero',
				id: 'tastataranieto',
				relationships: {
					firstParentID: 'tataranieto',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
			{
				name: 'Hija 2',
				firstSurname: 'Moya',
				gender: 'female',
				secondSurname: 'Guerrero',
				id: 'hija',
				relationships: {
					firstParentID: 'dani',
					secondParentID: 'cris',
				},
				user_uuid: 'awydQyik8Pa4NkFgdpCUm1i3Ilp2',
				created_at: { seconds: 1716927949, nanoseconds: 278000000 },
				updated_at: { seconds: 1716927949, nanoseconds: 278000000 },
			} as Person,
		] as Person[];

		// Fetch people from API
		// const rawPeople = await getBy<Person>();

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
