import { ref, watch } from 'vue';
import type { Familiar, Gender, Person } from '@/modules/people/models/Person.ts';
import { RelationCode } from '@/modules/people/models/Person.ts';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import { useStorage } from '@/modules/app/composables/useStorage.ts';

const root = useStorage<Person>('tree-root');
const relations = ref<Record<number, Familiar[]>>({});
const alreadyPaintedPeople = ref<Record<string, Person>>({});
export function useTreeService() {
	const { people } = usePeopleService();

	type KnownRelationPaths =
		'self'
		| 'self -> parent'
		| 'self -> sibling'
		| 'self -> parent -> child'
		| 'self -> sibling -> child'
		| 'self -> parent -> parent -> parent'
		| 'self -> parent -> parent -> parent -> parent'
		| 'self -> parent -> parent -> parent -> parent -> parent'
		| 'self -> parent -> parent'
		| 'self -> parent -> parent -> child'
		| 'self -> parent -> sibling'
		| 'self -> parent -> sibling -> child -> parent'
		| 'self -> parent -> sibling -> spouse'
		| 'self -> parent -> parent -> child -> child'
		| 'self -> parent -> sibling -> child'
		| 'self -> child'
		| 'self -> child -> child'
		| 'self -> child -> child -> child'
		| 'self -> child -> child -> child -> child'
		| 'self -> child -> child -> child -> child -> child'
		| 'self -> child -> parent'
		| 'self -> child -> spouse'
		| 'self -> spouse'
		| 'self -> spouse -> parent'
		| 'self -> spouse -> child'
		| 'self -> spouse -> sibling'
		| 'self -> parent -> spouse'
		;

	/**
	 * Get the relations of a person
	 * @param {string} relationPath - The path of the relation
	 * @param {Gender} gender - Gender of the person
	 * @param {boolean} isMarriageActive - If its marriage is active or not
	 *
	 * @returns {string} - The relation string
	 */
	function getRelationString(relationPath: string, gender: Gender, isMarriageActive?: boolean): string | undefined {
		const relationMap: { [key in KnownRelationPaths]: { male: string; female: string } } = {
			'self': { male: 'Selección', female: 'Selección' },
			'self -> parent': { male: 'Padre', female: 'Madre' },
			'self -> sibling': { male: 'Hermano', female: 'Hermana' },
			'self -> parent -> child': { male: 'Hermanastro', female: 'Hermanastra' },
			'self -> sibling -> child': { male: 'Sobrino', female: 'Sobrina' },
			'self -> parent -> parent -> parent': { male: 'Bisabuelo', female: 'Bisabuela' },
			'self -> parent -> parent -> parent -> parent': { male: 'Tatarabuelo', female: 'Tatarabuela' },
			'self -> parent -> parent -> parent -> parent -> parent': { male: 'Tastatarabuelo', female: 'Tastatarabuela' },
			'self -> parent -> parent': { male: 'Abuelo', female: 'Abuela' },
			'self -> parent -> parent -> child': { male: 'Tío', female: 'Tía' },
			'self -> parent -> sibling': { male: 'Tío', female: 'Tía' },
			'self -> parent -> sibling -> child -> parent': { male: 'Tío', female: 'Tía' },
			'self -> parent -> sibling -> spouse': { male: 'Tío', female: 'Tía' },
			'self -> parent -> parent -> child -> child': { male: 'Primo', female: 'Prima' },
			'self -> parent -> sibling -> child': { male: 'Primo', female: 'Prima' },
			'self -> child': { male: 'Hijo', female: 'Hija' },
			'self -> child -> child': { male: 'Nieto', female: 'Nieta' },
			'self -> child -> child -> child': { male: 'Bisnieto', female: 'Bisnieta' },
			'self -> child -> child -> child -> child': { male: 'Tataranieto', female: 'Tataranieta' },
			'self -> child -> child -> child -> child -> child': { male: 'Chozno', female: 'Chozna' },
			'self -> child -> parent': { male: isMarriageActive === true ? 'Esposo' : 'Pareja', female: isMarriageActive === true ? 'Esposa' : 'Pareja' },
			'self -> child -> spouse': { male: 'Yerno', female: 'Nuera' },
			'self -> spouse': { male: isMarriageActive === true ? 'Esposo' : 'Pareja', female: isMarriageActive === true ? 'Esposa' : 'Pareja' },
			'self -> spouse -> parent': { male: 'Suegro', female: 'Suegra' },
			'self -> spouse -> child': { male: 'Hijastro', female: 'Hijastra' },
			'self -> spouse -> sibling': { male: 'Cuñado', female: 'Cuñada' },
			'self -> parent -> spouse': { male: 'Padrastro', female: 'Madrastra' },
		};

		const lowercaseGender = gender.toLowerCase();
		const normalizedGender = !['male', 'female'].includes(lowercaseGender) ? 'male' : gender;
		const relation = relationMap[relationPath as KnownRelationPaths]?.[normalizedGender as 'male' | 'female'];
		if (!relation) {
			if (relationPath.includes('self -> parent -> parent -> parent -> parent -> parent')) {
				const parentCount = relationPath.split(' -> parent').length - 1 - 5;
				return gender === 'male'
					? `${'Padre del '.repeat(parentCount)}tastatarabuelo`
					: `${'Madre de la '.repeat(parentCount)}tastatarabuela`;
			}

			if (relationPath.includes('self -> child -> child -> child -> child -> child -> child')) {
				const childCount = relationPath.split(' -> child').length - 1 - 5;
				return gender === 'male'
					? `${'Hijo del '.repeat(childCount)}chozno`
					: `${'Hija de la '.repeat(childCount)}chozna`;
			}

			console.log(`🔴 Relation not found for path: ${relationPath}`);
		}
		return relation;
	}

	/**
	 * Get the relation code of a person
	 * @param {string} relationPath - The path of the relation
	 *
	 * @returns {RelationCode} - The relation code
	 */
	function getRelationCode(relationPath: string): RelationCode {
		const relationMap: { [key in KnownRelationPaths]: RelationCode } = {
			'self': RelationCode.SELF,
			'self -> parent': RelationCode.PARENT,
			'self -> sibling': RelationCode.SIBLING,
			'self -> sibling -> child': RelationCode.NEPHEW,
			'self -> parent -> child': RelationCode.STEP_SIBLING,
			'self -> parent -> parent -> parent': RelationCode.GREAT_GRANDPARENT,
			'self -> parent -> parent -> parent -> parent': RelationCode.GREAT_GREAT_GRANDPARENT,
			'self -> parent -> parent -> parent -> parent -> parent': RelationCode.GREAT_GREAT_GREAT_GRANDPARENT,
			'self -> parent -> parent': RelationCode.GRANDPARENT,
			'self -> parent -> parent -> child': RelationCode.UNCLE,
			'self -> parent -> sibling': RelationCode.UNCLE,
			'self -> parent -> sibling -> child -> parent': RelationCode.UNCLE,
			'self -> parent -> sibling -> spouse': RelationCode.UNCLE,
			'self -> parent -> parent -> child -> child': RelationCode.COUSIN,
			'self -> parent -> sibling -> child': RelationCode.COUSIN,
			'self -> child': RelationCode.CHILD,
			'self -> child -> child': RelationCode.GRANDCHILD,
			'self -> child -> child -> child': RelationCode.GREAT_GRANDCHILD,
			'self -> child -> child -> child -> child': RelationCode.GREAT_GREAT_GRANDCHILD,
			'self -> child -> child -> child -> child -> child': RelationCode.GREAT_GREAT_GREAT_GRANDPARENT,
			'self -> child -> parent': RelationCode.SPOUSE,
			'self -> child -> spouse': RelationCode.CHILD_IN_LAW,
			'self -> spouse': RelationCode.SPOUSE,
			'self -> spouse -> parent': RelationCode.PARENT_IN_LAW,
			'self -> spouse -> child': RelationCode.STEP_CHILD,
			'self -> spouse -> sibling': RelationCode.SIBLING_IN_LAW,
			'self -> parent -> spouse': RelationCode.STEP_PARENT,
		};

		return relationMap[relationPath as KnownRelationPaths] || RelationCode.OTHER;
	}

	/**
	 * Get the grade of affinity of a person, being lower the grade, closer the person is.
	 * Maximum is 5 for great-great-grandparents and great-great-grandchildren, all relations beyond that are
	 * considered the same grade.
	 * @param {string} relationPath - The path of the relation
	 * @param {string} relationString - The relation string
	 *
	 * @returns {number} - The grade of the person
	 */
	function getGrade(relationPath: string, relationString?: string): number {
		const relationMap: { [key in KnownRelationPaths]: number } = {
			'self': 0, // Selección
			'self -> child -> parent': 0, // Esposo
			'self -> spouse': 0, // Esposo
			'self -> child': 1, // Hijo
			'self -> spouse -> child': 1, // Hijastro
			'self -> parent': 1, // Padre
			'self -> parent -> spouse': 1, // Padrastro
			'self -> spouse -> parent': 1, // Suegro
			'self -> sibling': 2, // Hermano
			'self -> spouse -> sibling': 2, // Cuñado
			'self -> parent -> child': 2, // Hermanastro
			'self -> parent -> parent': 2, // Abuelo
			'self -> child -> child': 2, // Nieto
			'self -> sibling -> child': 3, // Sobrino
			'self -> parent -> parent -> child': 3, // Tío
			'self -> parent -> sibling': 3, // Tío
			'self -> parent -> sibling -> child -> parent': 3, // Tío
			'self -> parent -> sibling -> spouse': 3, // Tío
			'self -> parent -> parent -> parent': 3, // Bisabuelo
			'self -> child -> child -> child': 3, // Bisnieto
			'self -> parent -> parent -> child -> child': 4, // Primo
			'self -> parent -> sibling -> child': 4, // Primo
			'self -> parent -> parent -> parent -> parent': 5, // Tatarabuelo
			'self -> child -> child -> child -> child': 5, // Tataranieto
			'self -> parent -> parent -> parent -> parent -> parent': 5, // Tastatarabuelo
			'self -> child -> child -> child -> child -> child': 5, // Chozno
		};

		const relation = relationMap[relationPath as KnownRelationPaths] ?? null;
		if (relation === null) {
			if (!relationString) {
				console.log(`🔴 Generation not found for path: ${relationPath}`);
				return 6;
			}
		}
		return relation ?? 5;
	}

	/**
	 * Get the relations of a person by using a recursive algorithm
	 * @param {string} personID - The ID of the person to get the relations from
	 */
	function getRelations(personID: string): Record<number, Familiar[]> {
		console.log(`Started: getRelations`);
		const result: Familiar[] = [];

		const visited = new Set<string>();
		const queue: { id: string; path: string }[] = [{
			id: personID,
			path: 'self',
		}];

		while (queue.length > 0) {
			const { id, path } = queue.shift()!;
			const person = people.value[id];

			if (visited.has(id) || !person) {
				continue;
			}
			visited.add(id);

			const marriage = person.relationships.marriages?.find(m => m.spouseID === personID);
			const isMarried = path === 'self -> child -> parent' && marriage?.active;
			const relationString = getRelationString(path, person.gender, isMarried);
			result.push({
				relation: relationString,
				relationPath: path,
				relationCode: getRelationCode(path),
				grade: getGrade(path, relationString),
				data: person,
			});

			const {
				firstParentID,
				secondParentID,
				siblingsIDs,
				marriages,
			} = person.relationships;

			// Ancestors
			if (firstParentID && !visited.has(firstParentID)) {
				queue.push({ id: firstParentID, path: `${path} -> parent` });
			}
			if (secondParentID && !visited.has(secondParentID)) {
				queue.push({ id: secondParentID, path: `${path} -> parent` });
			}

			// Successors
			if (marriages) {
				for (const marriage of marriages) {
					if (marriage.spouseID && !visited.has(marriage.spouseID)) {
						queue.push({ id: marriage.spouseID, path: `${path} -> spouse` });
					}
					if (marriage.childrenIDs) {
						for (const childID of marriage.childrenIDs) {
							if (!visited.has(childID)) {
								queue.push({ id: childID, path: `${path} -> child` });
							}
						}
					}
				}
			}

			// Siblings
			if (siblingsIDs) {
				for (const siblingID of siblingsIDs) {
					if (!visited.has(siblingID)) {
						queue.push({ id: siblingID, path: `${path} -> sibling` });
					}
				}
			}
		}

		return result.reduce((acc, current) => {
			if (!acc[current.grade]) {
				acc[current.grade] = [];
			}
			acc[current.grade].push(current);
			return acc;
		}, {} as Record<number, Familiar[]>);
	}

	function updateRelations() {
		if (!root.value && Object.keys(people.value).length) {
			root.value = Object.values(people.value)[0];
		}
		console.log('🟢 Update relations');
		if (!Object.keys(relations.value).length && root.value && Object.keys(people.value).length) {
			relations.value = getRelations(root.value.id);
		}
	}

	watch([root, people, relations], () => {
		updateRelations();
	}, { immediate: true, deep: true });

	return {
		root,
		relations,
		updateRelations,
		alreadyPaintedPeople,
	};
}
