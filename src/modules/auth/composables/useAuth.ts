import { ref } from 'vue';
import type {
	Unsubscribe,
	User,
	UserCredential,
} from 'firebase/auth';
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { auth } from '@/utils/firebase.ts';
import router from '@/router.ts';

const user = ref<User>();
let unsubscribeAuthWatcher: Unsubscribe;

/**
 * Composable to manage authentication related data, such as the current user
 *
 * @example
 * const { user } = useAuthentication();
 */
export function useAuth() {
	const loading = ref(true);

	if (unsubscribeAuthWatcher) {
		unsubscribeAuthWatcher();
	}
	unsubscribeAuthWatcher = onAuthStateChanged(auth, async (state) => {
		if (state) {
			user.value = state;
		} else {
			user.value = undefined;
		}
		loading.value = false;
	});

	/**
	 * Signs in the user with email and password
	 * @param email
	 * @param password
	 * @returns {Promise<UserCredential>}
	 */
	async function signInWithPassword(email: string, password: string): Promise<UserCredential> {
		return signInWithEmailAndPassword(auth, email, password)
			.then((result) => {
				user.value = result.user;
				return result;
			})
			.catch((error) => {
				console.error('🔴 User could not login with password!', error);
				throw error;
			});
	}

	/**
	 * Logs the user out
	 */
	function logout() {
		signOut(auth)
			.then(async () => {
				// Empty the local storage except for these keys
				const KEYS_TO_KEEP = ['onboarding-seen'];
				Object.keys(localStorage).forEach((key) => {
					if (!KEYS_TO_KEEP.includes(key)) {
						localStorage.removeItem(key);
					}
				});

				await router.push('/logout');
			})
			.catch((error) => {
				console.error('🔴 Sign out threw an error!', error);
			});
	}

	return {
		loading,
		user,
		signInWithPassword,
		logout,
	};
}
