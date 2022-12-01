<!-- Default page that also displays reactions -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <section class="reaction-input">
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
      </section>
      
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
        <div class="left">
          <h2>
            Viewing all reactions
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <!-- <GetReactionsForm
            ref="getReactionsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get reactions"
          /> -->
        </div>
      </header>
      <section
        v-if="$store.state.reactions.length"
      >
        <ReactionComponent
          v-for="reaction in $store.state.reactions"
          :key="reaction.id"
          :reaction="reaction"
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
    this.$store.commit('refreshEnrollments');
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

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Inter';
    font-weight: normal;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.form {
  width: 500px;
}
</style>
