<!-- Reusable component representing a single review and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="review"
  >
    <!-- Display name of course if review always not editable, i.e. on profile page -->
    <section class="course-name" v-if="!editable">
      <h3>Review of {{ review.course }}</h3>
    </section>

    <header class = "top">
      <section class="author-info">
        <h3 class="author">
          <router-link :to="`/profile/${review.student.username}`">
            @{{ review.student.username }}&nbsp&nbsp
          </router-link>
        </h3>
        <p v-if="$store.state.username && review.student.username !== $store.state.username" class="similarity-tooltip">
          <em> Similarity Score: {{ $store.state.similarities[review.student.username]}} </em>
          <span class="tooltiptext">How similar your experiences might be, on a scale of 100. Read more via our FAQs.</span>
        </p>
      </section>
      
      <section class="author-experience" v-if="review.term"><b>Term</b>: {{review.term}}</section>

      <section class="author-experience" v-if="review.instructor"><b>Instructor</b>: {{review.instructor}}</section>

      <section class="author-experience" v-if="review.hours"><b>Hours/Week</b>: {{review.hours}}</section>

      <section class="author-experience" v-if="review.knowledge"><b>Prior Knowledge</b>: {{review.knowledge}}</section>

      <section class="author-experience" v-if="review.grade"><b>Grade</b>: {{review.grade}}</section>
      
    </header>
    <p
      class="content"
    >
      {{ review.content }}
    </p>

    <section class="ratings-info">
      <section class="rating" v-if="review.overallRating"><b>Overall Rating</b>: {{review.overallRating}}/5</section>

      <section class="rating" v-if="review.difficulty"><b>Difficulty</b>: {{review.difficulty}}/5</section>
    </section>

    <CourseReviewForm v-if="editing" :course="course" :editing="true" :review="review" v-on:stopEditing="stopEditing()"/>

    <section class="footer">
      <p class="date">Posted on {{ review.dateCreated }}</p>
      <!-- <i v-if="reaction.edited">(edited)</i> -->
      <div
        v-if="$store.state.username === review.student.username && editable"
        class="actions"
      >
        <!-- <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button> -->
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteReview">
          🗑️ Delete
        </button>
      </div>
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import CourseReviewForm from '@/components/Review/CourseReviewForm.vue';

export default {
  name: 'ReviewComponent',
  components: {CourseReviewForm},
  props: {
    // Data from the stored review
    review: {
      type: Object,
      required: true
    },
    course: {
      type: Object,
      required: false
    },
    editable: { // Whether the review should be editable -- make reviews not editable from profile page
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this review is in edit mode
      alerts: {} // Displays success/error messages encountered during review modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this review.
       */
      this.editing = true; // Keeps track of if a review is being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this review.
       */
      this.editing = false;
    },
    deleteReview() {
      /**
       * Deletes this review.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted review!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    Round(score){
        // rounds number to 1 decimal place
        return (Math.round(score*10)/10); 
      },
    submitEdit() {
      /**
       * Updates review to have the submitted draft content.
       */
      if (this.review.content === this.draft) { // TODO: Check if all other parameters remain same
        const error = 'Error: Edited review content should be different than current review content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited review!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the review's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/reviews/${this.review._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshReviews');
        this.$store.commit('refreshSimilarities');
        this.$store.commit('refreshCourses');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>

.actions button {
  background-color: white; /* Green */
  border-radius: 5px;
  color: black;
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
  margin: 5px
}

.actions button:hover {
  cursor: pointer;
}

.course-name {
  margin-top: 0px;
  color: salmon;
  font-weight: bold;
}

.course-name h3 {
  margin-top: 0px;
}

header {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  /* justify-content: space-between; */
}

.similarity-tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.similarity-tooltip .tooltiptext {
  visibility: hidden;
  width: 240px;
  top: 120%;
  left: 50%;
  margin-left: -120px; /* Use half of the width (120/2 = 60), to center the tooltip */
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  font-size: 12px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.similarity-tooltip:hover .tooltiptext {
  visibility: visible;
}

.author-info {
  display: flex;
  flex-flow: column nowrap;
}

.author {
  margin: 0px;
}

.author a {
  text-decoration: none;
  color: black;
}

.author-info p {
  margin: 0px 40px 8px 0px;
  font-size: small;
}

.author-experience {
  margin: 8px 40px 8px 0px;
  font-size: small;
  background-color: rgba(255, 160, 122, 0.25);
  border-radius: 25px;
  padding: 8px;
}
.review {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    margin: 16px;
    border-radius: 16px;
    font-family: "Inter"; 
}

.ratings-info {
  display: flex;
  flex-flow: row wrap;
  font-size: smaller;
}

.rating {
  margin: 8px 64px 8px 0px;
  font-size: smaller;
  background-color: rgba(255, 160, 122, 0.25);
  border-radius: 25px;
  padding: 8px;
}

.footer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.footer .date {
  font-size: small;
}
</style>
