export interface Person {
	id: string;
	name: string;
	firstSurname: string;
	secondSurname: string;
	gender: Gender;
	notes?: string;
	relationships: Relationships;
}

export type Gender = 'male' | 'female' | 'unknown';

export interface Relationships {
	firstParentID?: string;
	secondParentID?: string;
	siblingsIDs?: string[];
	marriages?: Marriage[];
}

export interface Marriage {
	spouseID?: string;
	active?: boolean;
	childrenIDs?: string[];
}

export interface Familiar {
	relationCode: RelationCode;
	relation?: string;
	relationPath: string;
	grade: number;
	data: Person;
}

export enum RelationCode {
	SELF = 'self',
	SPOUSE = 'spouse',
	SIBLING = 'sibling',
	UNCLE = 'uncle',
	NEPHEW = 'nephew',
	COUSIN = 'cousin',
	PARENT = 'parent',
	GRANDPARENT = 'grandparent',
	GREAT_GRANDPARENT = 'great_grandparent',
	GREAT_GREAT_GRANDPARENT = 'great_great_grandparent',
	GREAT_GREAT_GREAT_GRANDPARENT = 'great_great_great_grandparent',
	CHILD = 'child',
	GRANDCHILD = 'grandchild',
	GREAT_GRANDCHILD = 'great_grandchild',
	GREAT_GREAT_GRANDCHILD = 'great_great_grandchild',
	GREAT_GREAT_GREAT_GRANDCHILD = 'great_great_great_grandchild',
	OTHER = 'other',
}
