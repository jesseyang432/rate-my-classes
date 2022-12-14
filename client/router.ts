import Vue from 'vue';
import VueRouter from 'vue-router';
import ReactionsPage from './components/Reaction/ReactionsPage.vue';
import CoursesPage from './components/Course/CoursesPage.vue';
import CoursePage from './components/Course/CoursePage.vue';
import ProfilePage from './components/Profile/ProfilePage';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import FAQPage from './components/FAQ/FAQPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Reactions', component: ReactionsPage},
  {path: '/courses', name: 'Courses', component: CoursesPage},
  {path: '/course/:name', name: 'Course', component: CoursePage},
  {path: '/profile/:username', name: 'Profile', component: ProfilePage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/faqs', name: 'FAQ', component: FAQPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
