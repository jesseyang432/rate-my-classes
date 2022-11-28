<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h3>Welcome @{{ $store.state.username }}</h3>
      </header>
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
        <router-link v-for="course in $store.state.courses" class="course-page-link" :to="`course/${course.name}`">
          <CourseComponent
            :key="course.id"
            :course="course"
            :enrolled="isEnrolled(course.name)"
          />
        </router-link>
          <!-- <a href="test" v-for="course in $store.state.courses" class="course-page-link"> -->
            <!-- <CourseComponent
            :key="course.id"
            :course="course"
            :enrolled="isEnrolled(course.name)"
            /> -->
          <!-- </a> -->
        </section>
        <article
          v-else
        >
          <h3>No courses found.</h3>
        </article>
      </section>
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
  </main>
</template>

<script>
import CourseComponent from '@/components/Course/CourseComponent.vue';
import CreateReactionForm from '@/components/Reaction/CreateReactionForm.vue';

export default {
  name: 'HomePage',
  components: {CourseComponent, CreateReactionForm},
  mounted() {
    this.$store.commit('refreshCourses');
    this.$store.commit('refreshEnrollments');
  },
  methods: {
    isEnrolled(course) {
      return this.$store.state.enrollments.some((enrollment) => enrollment.toCourse.name === course);
    }
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

h2 {
  font-family: 'Inter';
  font-weight: bold;
  font-size: 30px;
}

h3 {
  font-family: 'Inter';
  font-weight: normal;
  font-size: 24px;
}

button {
    margin-right: 10px;
}

.course-page-link {
  text-decoration: none;
  color: black;
  margin: 16px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
