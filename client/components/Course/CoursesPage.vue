<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateReactionForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to RateMyClasses!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to add and view courses.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all courses
          </h2>
        </div>
        <!-- <div class="right">
          <GetReactionsForm
            ref="getReactionsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get reaction"
          />
        </div> -->
      </header>
      <section
        v-if="$store.state.courses.length"
      >
        <CourseComponent v-for="course in $store.state.courses"
          :key="course.id"
          :course="course"
        />
      </section>
      <article
        v-else
      >
        <h3>No courses found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import CourseComponent from '@/components/Course/CourseComponent.vue';

export default {
  name: 'HomePage',
  components: {CourseComponent},
  mounted() {
    this.$store.commit('refreshCourses');
  },
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
