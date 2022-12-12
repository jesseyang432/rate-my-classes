<!-- Reusable component representing a single reaction and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="like"
  >
        <!-- {{ reaction._id}} -->
        <button class="button-own-post" disabled
          v-if="ownPost()"
        >
         ♡ {{ reaction.numLikes }} likes
        </button>
        <button class="button-like"
          v-if="!isLiked() && !ownPost()"
          @click="likePost"
        >
          ♡ {{ reaction.numLikes }} likes
        </button>
        <button class="button-unlike"
          v-if="isLiked() && !ownPost()"
          @click="unlikePost"
        >
          ♥ {{ reaction.numLikes }} likes
        </button>
<!-- 
        <p class="info">
          Current Likes: {{ reaction.numLikes }}
        </p> -->

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
  name: 'LikeComponent',
  props: {
    // Data from the stored reaction
    reaction: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // numLikes: this.reaction.numLikes,
      alerts: {} // Displays success/error messages encountered during reaction modification
    };
  },
  methods: {
    ownPost() {
      return this.$store.state.username === this.reaction.student; 
    },
    isLiked() {
      /**
       * Returns whether the reaction is currently liked
       */
      const likes = this.$store.state.likes;
      const likesForThisPost =  likes.filter(like => like.post._id === this.reaction._id);
      const liked = likesForThisPost.filter(remainingLikes => remainingLikes.userLike === this.$store.state.username);
      return liked.length > 0;

    },
    likePost() {
      const params = {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({postId: this.reaction._id}), //TODO: add to follow
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully liked reaction!', status: 'success'
          });
          // setTimeout(() => this.$delete(this.alerts, error), 3000);
          this.$store.commit('updateLikes', this.reaction._id);
        }
      };
      this.request(params);
    },
    unlikePost() {

      const params = {
        method: 'DELETE', 
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({postId: this.reaction._id}), //TODO: add to follow
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully unliked reaction!', status: 'success'
          });
          // setTimeout(() => this.$delete(this.alerts, error), 3000);
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
        const r = await fetch('/api/likes', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.editing = false;
        this.$store.commit('refreshLikes');
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
.like {
    padding: 5px;
    position: relative;
}

.button-own-post {
  background-color: white; /* Green */
  border-radius: 5px;
  color: black;
  /* border: none; */
  height: 30px;
  width: 90px;
  /* padding: 10px 10px; */
  text-align: center;
  text-decoration: none;
  font-size: 15px;
  opacity: 50%;
}
.button-like {
  background-color: white; /* Green */
  border-radius: 5px;
  color: black;
  height: 30px;
  width: 90px;
  /* padding: 10px 10px; */
  text-align: center;
  text-decoration: none;
  font-size: 15px;
}

.button-unlike {
  background-color: salmon; /* Green */
  border-radius: 5px;
  color: white;
  height: 30px;
  width: 90px;
  /* padding: 10px 10px; */
  text-align: center;
  text-decoration: none;
  font-size: 15px;
}

button:hover {
  cursor: pointer;
}

.button-own-post:hover {
  cursor: not-allowed;
}

</style>
