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
          <EnrollButton v-if="!getEnrollment(course.name)" :course="course.name"/>
          <EnrollStatus v-else :course="course.name" :enrollmentType="enrollment ? enrollment.type : 'current'"/>
        </header>
        <p>
          {{ course.description }}
        </p>
      </section>

      <section class="review-section">
        <section v-if="getEnrollment(course.name)" viewer-review>
          <CourseReviewForm v-if="!getReview(course.name)" :course="course" :editing="false"/>
          <section v-else>
            <h2>Your Review</h2>
            <ReviewComponent :review="userReview" :course="course" :editable="true"/>
          </section>
        </section>
        
        <h2>Course Reviews</h2>
        <section class="review-explanation">
          <em>
            Reviews are a means of leaving feedback and ratings on courses you've taken. You can also leave ratings without writing a specific review.
          </em>
        </section>
        <ReviewComponent v-for="review in $store.state.reviews"
          v-if="review.course === course.name && review.content"
          :course="course"
          :key="review._id"
          :review="review"
          :editable="true"/>
      </section>
    </section>
  </main>
</template>
  
  <script>
  import EnrollButton from '@/components/Enroll/EnrollButton.vue';
  import EnrollStatus from '@/components/Enroll/EnrollStatus.vue';
  import CourseReviewForm from '@/components/Review/CourseReviewForm.vue';
  import ReviewComponent from '@/components/Review/ReviewComponent.vue';
  
  export default {
    name: 'CoursePage',
    components: {EnrollButton, EnrollStatus, CourseReviewForm, ReviewComponent},
    data() {
        return {
            loading: true,
            isEnrolled: false,
            enrollment: null,
            pageNotFound: true,
            course: null,
            userReview: null,
            reviews: [],
            reactions: [],
        };
    },
    async mounted() {
        this.$store.commit('refreshSimilarities');
        this.$store.commit('refreshReviews');
        await this.getCourse();
        this.getEnrollment(this.course.name);
        this.loading = false;
    },
    methods: {
        /**
         * Assigns the type of enrollment (if there is one) to enrollmentType
         * Returns true or false, depending on if enrolled
         */
        getEnrollment(courseName) {
          for (const enrollment of this.$store.state.enrollments) {
            if (enrollment.toCourse.name === courseName) {
              this.enrollment = enrollment;
              return true;
            }
          }
          return false;
        },
        /**
         * Assigns the user's review of the course to userReview (if there is one)
         * Returns true or false, depending on if there is a user review
         */
        getReview(courseName) {
          for (const review of this.$store.state.reviews) {
            if (review.course === courseName && review.student.username === this.$store.state.username) {
              this.userReview = review;
              return true;
            }
          }
          return false;
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

  .review-explanation {
    margin: 0px 32px 16px 32px;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
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
  