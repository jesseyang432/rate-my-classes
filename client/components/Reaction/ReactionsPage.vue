<!-- Default page that also displays reactions -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateReactionForm />
      <CreateReviewForm />
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
          <GetReactionsForm
            ref="getReactionsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get reactions"
          />
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
import CreateReviewForm from '@/components/Review/CreateReviewForm.vue';
import GetReactionsForm from '@/components/Reaction/GetReactionsForm.vue';

export default {
  name: 'ReactionPage',
  components: {ReactionComponent, GetReactionsForm, CreateReviewForm, CreateReactionForm},
  mounted() {
    this.$refs.getReactionsForm.submit();
    this.$store.commit('refreshEnrollments');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
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
