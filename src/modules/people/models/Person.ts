export interface Person {
	id?: string;
	name: string;
	firstSurname: string;
	secondSurname: string;
	gender: Gender;
	notes?: string;
	relationships: {
		firstParentID?: string;
		secondParentID?: string;
		siblingsIDs?: string[];
		marriages?: {
			spouseID?: string;
			active?: boolean;
			childrenIDs?: string[];
		}[];
	};
}

export type Gender = 'male' | 'female' | 'unknown';
