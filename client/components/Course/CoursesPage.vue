<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <section>
        <header>
          <div class="left">
            <h2>
              Viewing courses
            </h2>
          </div>
        </header>
        <input class="search-bar" v-model="filter" placeholder="Search by name">
        <section
          v-if="$store.state.courses.length"
        >
        <router-link
          v-for="course in $store.state.courses" class="course-page-link"
          v-if="toDisplay(course.name)"
          :to="`course/${course.name}`"
          :key="course.id">
          <CourseComponent
            :key="course.id"
            :course="course"
            :enrolled="isEnrolled(course.name)"
          />
        </router-link>
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
  name: 'CoursesPage',
  components: {CourseComponent, CreateReactionForm},
  data() {
    return {
      filter: ''
    };
  },
  mounted() {
    this.$store.commit('refreshCourses');
    this.$store.commit('refreshEnrollments');
    this.$store.commit('refreshAvgRatingsByClass');
  },
  methods: {
    toDisplay(courseName) {
      return courseName.toLowerCase().includes(this.filter.toLowerCase());
    },
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

.search-bar {
  padding: 8px;
  outline: none;
  font-size: large;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
