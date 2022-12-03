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
    reviews: [], // All reviews created in the app
    courses: [], // All courses in the app
    enrollments: [], // List of enrollments by a user
    username: null, // Username of the logged in user
    similarities: Object.create(null), // map of username to similarity score
    gettingSimilarities: false, // Whether similarities are currently being updated
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    profile: null,
    ratings: null,
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
   async updateProfile(state, username) {
      state.profile = await fetch(`/api/users/${username}`).then(async r => r.json());
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
    updateReviews(state, reviews) {
      /**
       * Update the stored reviews to the provided reviews.
       * @param reviews - reviews to store
       */
      state.reviews = reviews;
    },
    async refreshReactions(state) {
      /**
       * Request the server for the currently available reactions.
       */
      const url = '/api/reactions';
      const res = await fetch(url).then(async r => r.json());
      state.reactions = res;
    },
    async refreshReviews(state) {
      /**
       * Request the server for the currently available reviews.
       */
      const url = '/api/reviews';
      const res = await fetch(url).then(async r => r.json());
      state.reviews = res;
    },
    async refreshCourses(state) {
      /**
       * Request the server for all courses.
       */
      const url = '/api/courses';
      const res = await fetch(url).then(async r => r.json());
      state.courses = res;
    },
    async refreshEnrollments(state) {
      /**
       * Request the server for all enrollments of the logged in user.
       */
      const url = '/api/enroll';
      const res = await fetch(url).then(async r => r.json());
      state.enrollments = res;
    },
    async refreshSimilarities(state) {
      /**
       * Request the server for all similarity scores involving the user
       */
      const url = '/api/similarities'
      const res = await fetch(url).then(async r => r.json());
      res.forEach((similarity) => {
        if (similarity.student1.username === state.username) {
          Vue.set(state.similarities, similarity.student2.username, similarity.score);
        }
      });
      console.log(state.similarities);
    },
    
    async refreshAvgRatingsByClass(state) {
      state.ratings = new Map();
      for (const course of state.courses){
        const ratings = await fetch(`/api/reviews/course/${course.name}`).then(async r => r.json());
        var total = 0;
        for (const rating of ratings){
          total += rating.overallRating;
        }
        state.ratings[course.name] = (total * 1.0) / ratings.length;
        console.log(course.name);
        console.log(state.ratings[course.name]);
      }
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
