<!-- Reusable component representing a single reaction and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="reaction"
  >
    <header>
      <h3 class="author">
        @{{ reaction.author }}
      </h3>
      <div
        v-if="$store.state.username === reaction.author"
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
        <button @click="deleteReaction">
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
      {{ reaction.content }}
    </p>
    <p class="info">
      Posted at {{ reaction.dateModified }}
      <i v-if="reaction.edited">(edited)</i>
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
  name: 'ReactionComponent',
  props: {
    // Data from the stored reaction
    reaction: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this reaction is in edit mode
      draft: this.reaction.content, // Potentially-new content for this reaction
      alerts: {} // Displays success/error messages encountered during reaction modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this reaction.
       */
      this.editing = true; // Keeps track of if a reaction is being edited
      this.draft = this.reaction.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this reaction.
       */
      this.editing = false;
      this.draft = this.reaction.content;
    },
    deleteReaction() {
      /**
       * Deletes this reaction.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted reaction!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates reaction to have the submitted draft content.
       */
      if (this.reaction.content === this.draft) {
        const error = 'Error: Edited reaction content should be different than current reaction content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited reaction!',
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
       * Submits a request to the reaction's endpoint
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
        const r = await fetch(`/api/reactions/${this.reaction._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshReactions');

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
.reaction {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
