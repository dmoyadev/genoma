import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/modules/auth/composables/useAuth.ts';

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/modules/auth/pages/LoginPage.vue'),
		meta: {
			title: 'Iniciar sesión',
			isPublic: true,
		},
	},

	{
		path: '/logout',
		name: 'Logout',
		component: () => import('@/modules/auth/pages/LoginPage.vue'),
		meta: {
			title: 'Cerrar sesión',
			isPublic: true,
		},
		beforeEnter: (to) => {
			window.location.href = `/login${to.query?.redirect ? (`?redirect=${String(to.query.redirect)}`) : ''}`;
		},
	},

	{
		path: '',
		name: 'Home',
		component: () => import('@/modules/app/pages/HomePage.vue'),
		meta: { title: '' },

	},

	{
		path: '/onboarding',
		name: 'Onboarding',
		component: () => import('@/modules/onboarding/pages/OnboardingPage.vue'),
		meta: { title: 'Onboarding' },
	},

	{
		path: '/people/:id',
		name: 'Person',
		component: () => import('@/modules/people/pages/PersonPage.vue'),
		meta: { title: '{id}' },
	},

	{
		path: '/showcase',
		name: 'Component Showcase',
		component: () => import('@/showcase/ShowcasePage.vue'),
		meta: {
			title: 'Component Showcase',
			isPublic: true,
		},
	},

	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/modules/app/pages/NotFoundPage.vue'),
		meta: {
			title: 'Not Found',
			isPublic: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to) => {
	setDocumentTitle(to);
	const redirection = await checkAuth(to);
	return redirection || true;
});

/**
 * Set the document title with the app title as suffix and
 * adding the id to the title if it's a dynamic route.
 *
 * @param {RouteLocationNormalized} to - The route to which we are navigating
 */
function setDocumentTitle(to: RouteLocationNormalized) {
	const titleSuffix = import.meta.env.MODE !== 'production'
		? (` ${((import.meta.env.VITE_ENV_NAME as string | undefined) || import.meta.env.MODE).toUpperCase()}`)
		: '';
	document.title = `${to.meta?.title ? (`${String(to.meta.title)} | `) : ''}🧬 Genoma${titleSuffix}`;
}

async function checkAuth(to: RouteLocationNormalized) {
	if (to.meta?.isPublic) {
		return;
	}

	// TODO - This is a workaround for the firebase auth state change delay
	const { loading, user } = useAuth();
	if (!user.value) {
		while (loading.value) {
			await new Promise(resolve => setTimeout(resolve, 50));
		}
	}

	if (!user.value) {
		return `/logout${to.name === 'Login' ? '' : `?unauthorized=${to.fullPath}`}`;
	}
}

export default router;
