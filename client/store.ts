import { argThresholdOpts } from 'moment';
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
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    profile: null,
    ratings: Object.create(null),
    likes: [], //all of the likes
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
    setLikes(state, likes) {
      /**
       * Update the stored likes to the provided likes.
       * @param likes - likes to store
       */
      state.likes = likes;
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
    updateLikes(state, postId){ //NEW
      const newFreets = state.reactions.map(reaction => {
        if (reaction._id === postId) {
          return {
            ...reaction,
            numLikes: reaction.numLikes + 1,
          };
        }
        return reaction;
      })
      state.reactions = newFreets;
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
      for (const course of state.courses){
        const ratings = await fetch(`/api/reviews/course/${course.name}`).then(async r => r.json());
        var total = 0;
        for (const rating of ratings){
          total += rating.overallRating;
        }
        // let newRating = Object.create(null);
        // newRating[course.name] = Math.round((total * 10.0) / ratings.length) / 10; // round to nearest tenth
        // state.ratings = Object.assign(
        //   {},
        //   state.ratings,
        //   newRating
        // );
        Vue.set(state.ratings, course.name, Math.round((total * 10.0) / ratings.length) / 10); // round to nearest tenth
        console.log(state.ratings);
        // state.ratings[course.name] = (total * 1.0) / ratings.length;
        // console.log(course.name);
        // console.log(state.ratings[course.name]);
      }
    },
    async refreshLikes(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = '/api/likes';
      const res = await fetch(url).then(async r => r.json());
      state.likes = res;
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
          Vue.set(state.similarities, similarity.student2.username, Math.round(similarity.score * 10.0) / 10); // round to nearest tenth
        }
      });
      console.log(state.similarities);
    },
    
    // async refreshAvgRatingsByClass(state) {
    //   state.ratings = new Map();
    //   for (const course of state.courses){
    //     const ratings = await fetch(`/api/reviews/course/${course.name}`).then(async r => r.json());
    //     var total = 0;
    //     for (const rating of ratings){
    //       total += rating.overallRating;
    //     }
    //     state.ratings[course.name] = (total * 1.0) / ratings.length;
    //     console.log(course.name);
    //     console.log(state.ratings[course.name]);
    //   }
    // },
  },

  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
