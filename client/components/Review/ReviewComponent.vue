<!-- Reusable component representing a single review and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="review"
  >
    <header>
      <section class="author-info">
        <h3 class="author">
          @{{ review.student.username }}
        </h3>
        <p><em>Similarity Score: TODO</em></p>
      </section>
      
      <div
        v-if="$store.state.username === review.student.username"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
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
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ review.content }}
    </p>
    <p class="info">
      Posted at {{ review.dateCreated }}
      <!-- <i v-if="reaction.edited">(edited)</i> -->
    </p>
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
export default {
  name: 'ReviewComponent',
  props: {
    // Data from the stored review
    review: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this review is in edit mode
      draft: this.review.content, // Potentially-new content for this review
      alerts: {} // Displays success/error messages encountered during review modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this review.
       */
      this.editing = true; // Keeps track of if a review is being edited
      this.draft = this.review.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this review.
       */
      this.editing = false;
      this.draft = this.review.content;
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

header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.author-info {
  display: flex;
  flex-flow: column nowrap;
}

.author {
  margin: 0px;
}

.author-info p {
  margin: 0px;
  font-size: small;
}
.review {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
