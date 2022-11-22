import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown reactions by (null = show all)
    reactions: [], // All reactions created in the app
    courses: [], // All courses in the app
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored reactions filter to the specified one.
       * @param filter - Username of the user to fitler reactions by
       */
      state.filter = filter;
    },
    updateReactions(state, reactions) {
      /**
       * Update the stored reactions to the provided reactions.
       * @param reactions - Reactions to store
       */
      state.reactions = reactions;
    },
    async refreshReactions(state) {
      /**
       * Request the server for the currently available reactions.
       */
      const url = state.filter ? `/api/users/${state.filter}/reactions` : '/api/reactions';
      const res = await fetch(url).then(async r => r.json());
      state.reactions = res;
    },
    async refreshCourses(state) {
      /**
       * Request the server for all courses.
       */
      const url = '/api/courses';
      const res = await fetch(url).then(async r => r.json());
      state.courses = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
