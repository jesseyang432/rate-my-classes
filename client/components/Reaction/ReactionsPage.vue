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
              <p> You can post your thoughts on classes, write full-reviews, and read what other students have published as well. Learn more about the different classes at MIT.</p>
            </div>
          </div>
          </article>
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
    border: 1px solid #111;
    border-radius: 16px;
    margin-left: 150px;
    padding: 20px;
    position: relative;
    flex-direction: row;
    right: 20px;
    font-family: 'Inter';
  
}
</style>
