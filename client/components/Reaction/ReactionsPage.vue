<!-- Default page that also displays reactions -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <section class = 'top'>
        <CreateReactionForm class = "form" />
        <article class="info">
          <div class="row">
            <div>
              <img src="./mitlogo.png" alt="MIT logo" width="200">
            </div>
            <div>
              <p><strong> Hi there! Welcome to "Rate My Classes", a peer class feedback forum.</strong></p>
              <p> You can post your reactions on classes, write full-reviews, and read what other students have published as well. This is your chance to learn more about the different classes at MIT. Visit our <router-link to="/faqs">FAQs</router-link> to learn more!</p>
            </div>
          </div>
        </article>
      </section>
      <!-- <section class="reaction-input">
        <CreateReactionForm class = "form" />
        <section class="reaction-info">
          <section class="mit-logo">
            <img src="../../public/mit-logo.png">
          </section>
          <p class="reaction-info-text">
            Welcome to your peers’ class reaction page! Reactions are a means of short, immediate (&lt 140 characters) expression regarding how you feel about a course you're enrolled in.<br/><br/>

            Simply choose your course using the dropdown menus, type in a message, and submit your honest feedback. <br/><br/>

            Enjoy!
          </p>
        </section>
      </section> -->
      
    </section>
    <section v-else>
      <div class="row">
      <div class="column">
        <!-- <header>
          <h2>Welcome to Rate My Classes!</h2>
        </header> -->
        <article class="logged-out">
          <h3>
            <router-link to="/login">
              Sign in
            </router-link>
            to create, edit, and delete reactions.
          </h3>
        </article>
      </div>
      <article class="info">
          <div class="row">
            <div>
              <img src="./mitlogo.png" alt="MIT logo" width="200">
            </div>
            <div>
              <p><strong> Hi there! Welcome to "Rate My Classes", a peer class feedback forum.</strong></p>
              <p> You can post your reactions on classes, write full-reviews, and read what other students have published as well. This is your chance to learn more about the different classes at MIT. Visit our <router-link to="/faqs">FAQs</router-link> to learn more!</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section>
      <header>
        <div>
          <h2>
            Recent<span class="reactions-text">Reactions <div class="tooltiptext">Short, informal comments on currently enrolled courses</div></span>
            <!-- <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span> -->
          </h2>     
        </div>
      </header>
        <section class="reaction-explanation">
          <em>
            Read more about reactions at our <router-link to="/faqs">FAQ page</router-link>.
          </em>
        </section>

      <header 
          v-if="$store.state.username" 
          class="reaction-tabs">
          <button v-if="content === 'All Classes'" class="selected-tab" @click="() => {content = 'All Classes';}">All Classes</button>
          <button v-else @click="() => {content = 'All Classes';}">All Classes</button>
          <button v-if="content === 'Current Classes'" class="selected-tab" @click="() => {content = 'Current Classes';}">Current Classes</button>
          <button v-else @click="() => {content = 'Current Classes';}">Current Classes</button>
      </header>

      <section 
        v-if="content === 'All Classes'">
        <section
          v-if="$store.state.reactions.length "
          class="reaction-display"
        >
          <ReactionComponent
            v-for="reaction in $store.state.reactions"
            :key="reaction.id"
            :reaction="reaction"
            :editable="true"
          />
        </section>
          <article
            v-else
          >
            <h3>No reactions found.</h3>
          </article>
      </section>
      <section v-else> 
        <section
          v-if="$store.state.reactions.length "
          class="reaction-display"
        >
          <ReactionComponent
            v-for="reaction in enrolledReactions"
            :key="reaction.id"
            :reaction="reaction"
            :editable="true"
          />
        </section>
        
          <article v-else>
            <h3>No reactions found.</h3>
          </article>
        
      </section>
    </section>

    
  </main>
</template>

<script>
import ReactionComponent from '@/components/Reaction/ReactionComponent.vue';
import CreateReactionForm from '@/components/Reaction/CreateReactionForm.vue';
import GetReactionsForm from '@/components/Reaction/GetReactionsForm.vue';

export default {
  name: 'ReactionPage',
  components: {ReactionComponent, GetReactionsForm, CreateReactionForm},
  data() {
    return {
      content: 'All Classes', // or current
      enrolledReactions: []
    };
  },
  mounted() {
    // this.$refs.getReactionsForm.submit();
    this.$store.commit('refreshReactions');
    this.$store.commit('refreshEnrollments');
    this.$store.commit('refreshCourses');
    this.$store.commit('refreshLikes'); 
    this.populateEnrolledReactions();
  }, 
  methods: {
    populateEnrolledReactions(){
      // get currently or previously enrolled classes from 
      const currentClassObjs = this.$store.state.enrollments.filter( (enrollment) => {
        return enrollment.type === "current" || enrollment.type === "interested"; 
      });
      const currentClassNames = currentClassObjs.map(enrollment => enrollment.toCourse.name); 
      console.log(currentClassNames);
      // get reactions with class in above and update
      this.enrolledReactions = this.$store.state.reactions.filter( (reaction) => {
        return currentClassNames.includes(reaction.course); 
      }); 
      
    }
  }

};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

.logged-out {
  font-family: 'Inter'; 
}

.reaction-input {
  display: flex;
  flex-flow: row nowrap;
  font-family: 'Inter';
  font-weight: normal;
}

.mit-logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reaction-info {
  margin-left: 96px;
  width: 100%;
  border: 1px solid #A9A9A9;
  background-color: #F6F6F6;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  font-size: smaller;
}


.reaction-info img {
  width: 160px;
  margin: 32px;
}

.reaction-info-text {
  margin: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reactions-text {
  position: relative;
  display: inline-block;
  border-bottom: 2px dotted black; /* If you want dots under the hoverable text */
  margin-left: 6px;
}

/* Tooltip text */
.reactions-text .tooltiptext {
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
  font-weight: normal;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.reactions-text:hover .tooltiptext {
  visibility: visible;
}

header, header > * {
    display: flex;
    /*align-items: flex-start;*/
    font-family: 'Inter';
    font-weight: normal;
}

button {
    margin-right: 10px;
}


.reaction-tabs {
  justify-content: center;
}

.reaction-tabs button {
  border: none;
  background: none;
  font-size: 20px;
  font-family: 'Inter';
  margin: 16px;
  outline: none;
}

.reaction-tabs button:hover {
  cursor: pointer;
}

.selected-tab {
  font-weight: bold;
  color: salmon;
  text-underline-offset: 0.2em;
  text-decoration: underline salmon;
}

.reaction-display {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.form {
  width: 500px;
}

.reaction-explanation {
    margin-bottom: 16px;
    /* margin: 0px 32px 16px 32px; */
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    font-family: 'Inter';
  }
.row {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin: 30px;
  gap: 20px;
}
.top {
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.info {
    background-color: #f2f2f2;
    color: white;
    max-width: 700px;
    border-radius: 16px;
    margin-left: 150px;
    padding: 20px;
    position: relative;
    flex-direction: row;
    right: 20px;
    font-family: 'Inter';
    background-image: url("mit.jpeg");
    background-position: center;
    background-color: grey;
    background-blend-mode: multiply;
}

.info a {
  color: white;
}
</style>
