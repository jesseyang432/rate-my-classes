<!-- Reusable component representing a single reaction and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="reaction"
  >
    <header>
      <div v-if="reaction.course.startsWith('6.')"
        class="header-6">
        <section class="course">
        <div class="author">
          <router-link :to="`/profile/${reaction.student}`">
            <img src="./daniel.png" width="40px">
          </router-link>
          <router-link :to="`/profile/${reaction.student}`">
            &nbsp @{{ reaction.student }}
          </router-link>
        </div>
        <router-link :to="`course/${reaction.course}`">
          <div class="link">
            {{ reaction.course }}
          </div>
        </router-link>
      </section>
      </div>
      <div v-if="reaction.course.startsWith('14.')"
        class="header-14">
        <section class="course">
        <div class="author">
          <router-link :to="`/profile/${reaction.student}`">
            <img src="./daniel.png" width="40px">
          </router-link>
          <router-link :to="`/profile/${reaction.student}`">
            &nbsp @{{ reaction.student }}
          </router-link>
        </div>
        <router-link :to="`course/${reaction.course}`">
          <div class="link">
            {{ reaction.course }}
          </div>
        </router-link>
      </section>
      </div>
      <div v-if="reaction.course.startsWith('18.')"
        class="header-18">
        <section class="course">
        <div class="author">
          <router-link :to="`/profile/${reaction.student}`">
            <img src="./daniel.png" width="40px">
          </router-link>
          <router-link :to="`/profile/${reaction.student}`">
            &nbsp @{{ reaction.student }}
          </router-link>
        </div>
        <router-link :to="`course/${reaction.course}`">
          <div class="link">
            {{ reaction.course }}
          </div>
        </router-link>
      </section>
      </div>
    </header>

    <section class="reaction-content">
      <section class="upper-reaction-content">
        <section class="author">
          <!-- <div class="vertical-align">
          <img src="./daniel.png" width="50px"> @{{ reaction.student }}
          </div> -->
      </section>
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
      <div
          v-if="$store.state.username === reaction.student && editable"
          class="actions"
        >
          <button class="button"
            v-if="editing"
            @click="submitEdit"
          >
            Save
          </button>
          <button class="button"
            v-if="editing"
            @click="stopEditing"
          >
            Discard
          </button>
          <button class="button"
            v-if="!editing"
            @click="startEditing"
          >
            Edit
          </button>
          <button class="button"
          @click="deleteReaction">
            Delete
          </button>
        </div>
    </section>
    <section class="info">
      <p>
        {{ reaction.dateCreated }}
        <i v-if="reaction.edited">(edited)</i>
      </p>
      <LikeComponent
        :reaction="reaction"
      />
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </section>
    
    </section>
  </article>
</template>

<script>
import LikeComponent from '@/components/Like/LikeComponent.vue';
export default {
  name: 'ReactionComponent',
  components: {LikeComponent},
  computed: {
    getColor() {
      if (reaction.course.startsWith("6.")){
        return 6;
      }
      else if(reaction.course.startsWith("14.")){
        return 14;
      }

    }
  },
  props: {
    // Data from the stored reaction
    reaction: {
      type: Object,
      required: true
    },
    // Whether reaction is editable (not editable from profile)
    editable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this reaction is in edit mode
      draft: this.reaction.content, // Potentially-new content for this reaction
      alerts: {}, // Displays success/error messages encountered during reaction modification
      courseTitle: this.reaction.course,
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

/* header {
    display: flex; */
    /* background-color: #fcaca3; */
    /* flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold; */
    /* border-radius: 15px 15px 0px 0px; */
    /* height: 90px; */
  /* } */

.header-6 {
    display: flex;
    background-color: lightsalmon;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold;
    border-radius: 15px 15px 0px 0px;
    height: 90px;
    width: 400px;
  }

.header-18 {
    display: flex;
    background-color: lightpink;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold;
    border-radius: 15px 15px 0px 0px;
    height: 90px;
    width: 400px;
  }

.header-14 {
    display: flex;
    background-color: lightblue;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold;
    border-radius: 15px 15px 0px 0px;
    height: 90px;
    width: 400px;
  }

.author {
    display: flex;
    font-size: 25px;
    flex-flow: row nowrap;
    /* justify-content: space-between; */
    align-items: center;
    vertical-align: left;
    font-family: 'Inter';
    font-weight: bold;
  }

.author a {
  text-decoration: none;
  color: black;
}

img {
  border-radius: 50%;
}
  
.course {
  font-size: 16px;
  padding: 20px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course a {
  text-decoration: none;
  color: white;
}
.info {
  display: flex;
  font-size: 13px;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  vertical-align: left;
}

.button {
  background-color: white; /* Green */
  border-radius: 5px;
  color: black;
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
  margin: 5px
}

.button:hover {
  cursor: pointer;
}

.reaction {
    /* border: 2px solid #111; */
    font-size: medium;
    width: 400px;
    /* height: 260px; */
    box-shadow: 7px 7px #f2f2f2;
    background-color: white;
    font-family: 'Inter';
    position: relative;
    margin: 32px 8px;
    border-radius: 15px;
    overflow-wrap: break-word;
}

.actions {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

.actions button {
  border: 0px;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  background-color: #fdc0b9;
  margin-top: 0px;
  color: black;
  block-size: fit-content;
  width: fit-content;
}

.link {
  margin: 0 30px;
  font-family: 'Inter';
  font-weight: normal;
  color: white;
}

textarea {
    font-family: inherit;
    font-size: inherit;
    width: 100%;
    border: 0px;
    border-radius: 20px;
    padding: 8px 12px;
    padding-bottom: 24px;
    font-size: .8em;
    background-color: #F6F6F6;
    margin-top: 8px;
    outline: none;
}

.reaction-content {
  padding: 8px;
  margin: 16px 32px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
