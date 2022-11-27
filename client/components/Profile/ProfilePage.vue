<!-- Default page that also displays reactions -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <router-link
        to="/account"
      >
        Account Settings
      </router-link>
      <!-- TODO -->
      <EnrollForm/>
      <h2>Enrolled Courses</h2>
      <section
        v-if="$store.state.enrollments.length"
      >
        <p
          v-for="enrollment in $store.state.enrollments"
          :key="enrollment.id">
          {{enrollment.toCourse.name}}
        </p>
      </section>
      <article
        v-else
      >
        <h3>You are not enrolled in any courses.</h3>
      </article>
    </section>
    <section v-else>
      You must be logged in to view your profile.
    </section>
  </main>
</template>

<script>
import EnrollForm from '@/components/Enroll/EnrollForm.vue';

export default {
  name: 'ProfilePage',
  components: {EnrollForm},
  mounted() {
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
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
