<!-- Page that displays a single course -->

<template>
  <main>
    <section v-if="loading">
      <header>
        <h2>Loading...</h2>
      </header>
    </section>
    <!-- <section v-else-if="pageNotFound">
      <header>
        <h2>Course Not Found!</h2>
      </header>
    </section> -->
    <section v-else-if="!$store.state.username">
      <header>
        <h2>Login to view this page!</h2>
      </header>
    </section>
    <section v-else>
      <section>
        <header>
          <div class="left">
            <h2>
              {{ course.name }}
            </h2>
          </div>
          <EnrollButton v-if="!isEnrolled(course.name)" :course="course.name"/>
          <EnrollStatus v-else :course="course.name"/>
        </header>
        <p>
          {{ course.description }}
        </p>
      </section>
    </section>
  </main>
</template>
  
  <script>
  import EnrollButton from '@/components/Enroll/EnrollButton.vue';
  import EnrollStatus from '@/components/Enroll/EnrollStatus.vue';
  
  export default {
    name: 'CoursePage',
    components: {EnrollButton, EnrollStatus},
    data() {
        return {
            loading: true,
            pageNotFound: true,
            course: null,
            reviews: [],
            reactions: [],
        };
    },
    async mounted() {
        await this.getCourse();
        this.loading = false;
    },
    methods: {
        isEnrolled(course) {
          return this.$store.state.enrollments.some((enrollment) => enrollment.toCourse.name === course);
        },
        async getCourse() {
            const url = `/api/courses/${this.$route.params.name}`;
            const r = await fetch(url);
            let res;
            if (!r.ok) {
              // If response is not okay, we throw an error and enter the catch block
              res = await r.json();
              throw new Error(res.error);
            } else {
              res = await r.json();
              this.pageNotFound = false;
            }
            this.course = res;
        },
    },
  };
  </script>
  
  <style scoped>

  main {
    min-height: 100vh;
  }

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
  