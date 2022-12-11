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
      <header>
        <h2>Welcome to Rate My Classes!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete reactions.
        </h3>
      </article>
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
      <section
        v-if="$store.state.reactions.length"
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
  </main>
</template>

<script>
import ReactionComponent from '@/components/Reaction/ReactionComponent.vue';
import CreateReactionForm from '@/components/Reaction/CreateReactionForm.vue';
import GetReactionsForm from '@/components/Reaction/GetReactionsForm.vue';

export default {
  name: 'ReactionPage',
  components: {ReactionComponent, GetReactionsForm, CreateReactionForm},
  mounted() {
    // this.$refs.getReactionsForm.submit();
    this.$store.commit('refreshReactions');
    this.$store.commit('refreshEnrollments');
    this.$store.commit('refreshCourses');
    this.$store.commit('refreshLikes');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
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
    justify-content: space-between;
    align-items: flex-start;
    font-family: 'Inter';
    font-weight: normal;
}

button {
    margin-right: 10px;
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
