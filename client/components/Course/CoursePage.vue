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
      <section class="course-header">
        <header>
          <div class="left">
            <h2>
              {{ course.name }}
            </h2>
          </div>
          <EnrollButton v-if="!getEnrollment(course.name)" :course="course.name"/>
          <EnrollStatus v-else :course="course.name" :enrollmentType="getEnrollment(course.name) ? enrollment.type : 'current'"/>
        </header>
        <section class="course-info">
          <section class="course-description">
            <p>
            <em>Course description:</em>
            {{ course.description }}
            </p>
          </section>
          <section class="course-summary">
            <section class="course-stats">
              <p id="overall-rating"><b>Overall Rating:</b> {{$store.state.ratings[course.name]}}/5</p>
              <section class="additional-stats">
                <p><b>Avg Hours:</b> {{$store.state.hours[course.name]}}</p>
                <p><b>Avg Difficulty:</b> {{$store.state.difficulties[course.name]}}/5</p>
              </section>
            </section>
            <p class="num-reviewers"># of Ratings/Reviewers: {{$store.state.numReviewers[course.name]}}</p>
          </section>
          

        </section>
      </section>

      <header 
          class="review-reaction-tabs">
          <button v-if="content === 'Reviews'" class="selected-tab" @click="() => {content = 'Reviews';}">Reviews</button>
          <button v-else @click="() => {content = 'Reviews';}">Reviews</button>
          <button v-if="content === 'Reactions'" class="selected-tab" @click="() => {content = 'Reactions';}">Reactions</button>
          <button v-else @click="() => {content = 'Reactions';}">Reactions</button>
      </header>

      <section 
        v-if="content==='Reviews'"
        class="review-section">
        <section v-if="(getEnrollment(course.name) && enrollment.type === 'previous')" viewer-review>
          <CourseReviewForm v-if="!getReview(course.name)" :course="course" :editing="false"/>
          <section v-else>
            <header>
              <h2>Your Review</h2>
            </header>
            <ReviewComponent :review="userReview" :course="course" :editable="true"/>
          </section>
        </section>
          <div>
            <header>
              <h2>Course<span class="reviews-text">Reviews <div class="tooltiptext">Feedback containing past student experiences with courses</div></span>
              </h2>
            </header>
          </div>
        <section class="review-explanation">
          <em>
            Read more about reviews and similarity scores at our <router-link to="/faqs">FAQ page</router-link>.
          </em>
        </section>
        <ReviewComponent class = "review-box" v-for="review in $store.state.reviews"
          v-if="review.course === course.name && review.content"
          :course="course"
          :key="review._id"
          :review="review"
          :editable="true"/>
      </section>

    <section v-else>
      <header>
        <h2>Course Reactions</h2>
      </header>
      <section
          v-if="reactions.length "
          class="reaction-display"
        >
          <ReactionComponent
            v-for="reaction in reactions"
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

    </section>
  </main>
</template>
  
  <script>
  import EnrollButton from '@/components/Enroll/EnrollButton.vue';
  import EnrollStatus from '@/components/Enroll/EnrollStatus.vue';
  import CourseReviewForm from '@/components/Review/CourseReviewForm.vue';
  import ReviewComponent from '@/components/Review/ReviewComponent.vue';
  import ReactionComponent from '@/components/Reaction/ReactionComponent.vue';
  
  export default {
    name: 'CoursePage',
    components: {EnrollButton, EnrollStatus, CourseReviewForm, ReviewComponent, ReactionComponent},
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
            content: "Reviews"
        };
    },
    async mounted() {
        this.$store.commit('refreshSimilarities');
        this.$store.commit('refreshReviews');
        this.$store.commit('refreshEnrollments');
        await this.getCourse();
        this.getEnrollment(this.course.name);
        this.loading = false;
        console.log(this.course); 
        await this.getReactions();
    },
    methods: {
        /**
         * Assigns the enrollment (if there is one) to this.enrollment
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
        async getReactions(){
          console.log(this.$store.state.reactions); 
          this.reactions = this.$store.state.reactions.filter(reaction => {return this.course.name === reaction.course;});
          console.log('hi', this.reactions); 
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
    font-family: 'Inter';
  }

  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-family: "Inter";
      font-weight: bold;
  }

  p {
    font-family: "Inter";
    font-weight: normal;
  }

  .course-description {
    margin-right: 64px;
  }

  .course-info {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .course-stats {
    min-width: 300px;
    height: 128px;
    text-align: center;
    /* border: solid black 1px; */
    /* background-color: salmon; */
    background-color: rgba(255, 160, 122, 0.25);
    color: black;
    padding: 16px;
    border-radius: 16px;
    margin: 16px;
    margin-bottom: 0px;
    font-size: small;
  }

  .review-box {
    width: 60%;
    margin-left: 20%;
    background-color: rgba(255, 160, 122, 0.025);
  }

  .num-reviewers {
    margin: 4px 16px;
    font-size: small;
    text-align: center;
  }

  #overall-rating {
    font-size: 24px;
    margin: 16px 0px;
  }

  .additional-stats {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    /* align-items: center;
    justify-content: center; */
  }

  /* .additional-stats p { */
    /* margin-right: 32px; */
  /* } */

.reviews-text {
  position: relative;
  display: inline-block;
  border-bottom: 2px dotted black; /* If you want dots under the hoverable text */
  margin-left: 6px;
}

/* Tooltip text */
.reviews-text .tooltiptext {
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
.reviews-text:hover .tooltiptext {
  visibility: visible;
}

  .review-explanation {
    margin-bottom: 16px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    font-family: 'Inter';
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }

.review-reaction-tabs {
  justify-content: center;
}

.review-reaction-tabs button {
  border: none;
  background: none;
  font-size: 32px; 
  font-weight: "heavy";
  margin: 16px;
  padding: 16px; 
  outline: none;
}

  .review-reaction-tabs button:hover {
  cursor: pointer;
}

.selected-tab {
  font-weight: bold;
  color: salmon;
  text-underline-offset: 0.2em;
  text-decoration: underline salmon;
}

.reaction-display {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}
  </style>
  