import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/modules/auth/composables/useAuth.ts';

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/modules/auth/pages/LoginPage.vue'),
		meta: {
			title: 'Login',
			isPublic: true,
		},
	},
	
	{
		path: '/logout',
		name: 'Logout',
		component: () => import('@/modules/auth/pages/LoginPage.vue'),
		meta: { title: 'Logout' },
		beforeEnter: (to) => {
			window.location.href = `/login${to.query?.redirect ? (`?redirect=${String(to.query.redirect)}`) : ''}`;
		},
	},
	
	{
		path: '',
		name: 'Home',
		component: () => import('@/modules/app/pages/HomePage.vue'),
		meta: {
			title: 'Home',
			isPublic: false,
		},
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
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to) => {
	setDocumentTitle(to);
	const redirection = checkAuth(to);
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
	document.title = `${to.meta?.title ? (`${to.meta.title} | `) : ''}🧬 Genoma${titleSuffix}`;
}

function checkAuth(to: RouteLocationNormalized) {
	if (to.meta?.isPublic) {
		return;
	}
	
	const { user } = useAuth();
	if (!user.value) {
		return `/login${to.name === 'Home' ? '' : `?unauthorized=${to.fullPath}`}`;
	}
}


export default router
