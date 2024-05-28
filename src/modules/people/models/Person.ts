export interface Person {
	id?: string;
	name: string;
	fatherName: string;
	motherName: string;
	gender: Gender;
	notes?: string;
}

export type Gender = 'male' | 'female' | 'unknown';
