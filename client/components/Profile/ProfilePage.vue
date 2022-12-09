<!-- Default page that also displays reactions -->

<template>
  <main>
    <section v-if="loading">
      <h2>Loading... </h2>
    </section>
    <section v-else>
    <section class="row">
      <h2>@{{$route.params.username}}</h2> 
      <router-link class = "button" to="/account" v-if="$store.state.username === $route.params.username">
          Edit Profile
      </router-link>
    </section>
    <div class = "page">
      <div class = "sideBar">
        <h2>Info</h2>
        <article class="info">
          <p><strong>Class Year: </strong>{{profile.classYear}}</p>
          <p><strong>Major: </strong>{{profile.major}}</p>
          <p><strong>Reviews: </strong>{{reviews.length}}</p>
          <p><strong>Reactions: </strong>{{reactions.length}}</p>
        </article>
        <br>
        <div v-if = "!$store.state.enrollments.length && isUser">
            <em>Go to
              <router-link class="course-page-link" :to="`courses`">
              <strong>Courses</strong>
              </router-link>
              to add courses
            </em>
        </div>
        <article v-if="isUser" class="info">
          <p><strong>Current Courses: </strong></p>
          <div v-for="enrollment in $store.state.enrollments" v-if="enrollment.type === 'current'" :key="enrollment.toCourse.id" id = "status-button">
            <router-link class="course-page-link" :to="`/course/${enrollment.toCourse.name}`">
              {{enrollment.toCourse.name}}
            </router-link>
          </div>
        </article>

        <article v-if="isUser" class="info">
          <p><strong>Interest Courses: </strong></p>
          <div v-for="enrollment in $store.state.enrollments" v-if="enrollment.type === 'interested'" :key="enrollment.toCourse.id" id = "status-button">
            <router-link class="course-page-link" :to="`/course/${enrollment.toCourse.name}`">
              {{enrollment.toCourse.name}}
            </router-link>
          </div>
        </article>

        <article v-if="isUser" class="info">
          <p><strong>Previous Courses: </strong></p>
          <div v-for="enrollment in $store.state.enrollments" v-if="enrollment.type === 'previous'" :key="enrollment.toCourse.id" id = "status-button">
            <router-link class="course-page-link" :to="`/course/${enrollment.toCourse.name}`">
              {{enrollment.toCourse.name}}
            </router-link>
          </div>
        </article>
      </div>

      <div class = "content">
        <h2>Contributions</h2>
        <header class="contributions-tabs">
          <button v-if="content === 'reviews'" class="selected-tab" @click="() => {content = 'reviews';}">Reviews</button>
          <button v-else @click="() => {content = 'reviews';}">Reviews</button>
          <button v-if="content === 'reactions'" class="selected-tab" @click="() => {content = 'reactions';}">Reactions</button>
          <button v-else @click="() => {content = 'reactions';}">Reactions</button>
        </header>

        <section v-if="content === 'reviews'">
          <ReviewComponent v-for="review in reviews"
            :key="review._id"
            :review="review"
            :editable="false"
          />
        </section>

        <section v-if="content === 'reactions'" class="reactions-display">
          <ReactionComponent v-for="reaction in reactions"
            :key="reaction._id"
            :reaction="reaction"
            :editable="false"
          />
        </section>
      </div>
      
    </div>
  </section>
  </main>
</template>

<script>
import CourseComponent from '@/components/Course/CourseComponent.vue';
import ReviewComponent from '@/components/Review/ReviewComponent.vue';
import ReactionComponent from '@/components/Reaction/ReactionComponent.vue';
import EnrollForm from '@/components/Enroll/EnrollForm.vue';
// import 'vue-awesome/icons/star'
// import 'vue-awesome/icons/star-o'

// import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'ProfilePage',
  components: {CourseComponent, ReviewComponent, ReactionComponent, EnrollForm},
  data() {
    return {
      content: 'reviews',
      reviews: [],
      reactions: [],
      profile: null,
      loading: true,
    };
  },
  async mounted() {
    this.$store.commit('refreshCourses');
    this.$store.commit('refreshEnrollments');
    this.$store.commit('refreshReviews');
    this.$store.commit('refreshReactions');
    this.profile = await fetch(`/api/users/${this.$route.params.username}`).then(async r => r.json());
    this.reviews = this.$store.state.reviews.filter((review) => review.student.username === this.$route.params.username);
    this.reactions = this.$store.state.reactions.filter((reaction) => reaction.student === this.$route.params.username);
    this.loading = false;
    // this.reviews = this.$store.state.reviews.filter((review) => review.student.username === this.$route.params.username);
    // this.reactions = this.$store.state.reactions.filter((reaction) => reaction.student === this.$route.params.username);
  },
  created() {
    this.reviews = this.$store.state.reviews.filter((review) => review.student.username === this.$route.params.username);
    this.reactions = this.$store.state.reactions.filter((reaction) => reaction.student === this.$route.params.username);
  },
  computed: {
    isUser() {
      return this.$store.state.username === this.$route.params.username;
    }
  },
  methods: {
    isEnrolled(course) {
      return this.$store.state.enrollments.some((enrollment) => enrollment.toCourse.name === course);
    }
  },
  watch: {
    '$route.params.username'(newUsername, oldUsername) {
      this.reviews = this.$store.state.reviews.filter((review) => review.student.username === newUsername);
      this.reactions = this.$store.state.reactions.filter((reaction) => reaction.student === newUsername);
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

h2 {
  font-family: 'Inter';
  font-weight: bold;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.info {
    border: 1px solid #111;
    border-radius: 16px;
    margin: 16px;
    padding: 20px;
    position: relative;
    flex-direction: row;
    right: 20px;
    font-family: 'Inter';
  
}

.page {
  display: flex;
}

.sideBar{
  width: 400px;
}

.course-page-link {
  text-decoration: none;
  color: black;
}

.content {
  width: 300px;
  flex: 1 0 auto;
  right: 200px;
}

.content header {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#status-button {
  border-radius: 8px;
  /* background-color: #e7e7e7; */
  background-color: #fcaca3;
  color: black;
  border: none;
  padding: 8px 12px;
  margin-right: 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-family: 'Inter'; 
  margin-top: 10px;
  text-align: left;
}

.button {
  background-color: salmon; /* Green */
  border: 1px solid #111;
  border-radius: 5px;
  color: white;
  padding: 10px 10px;
  text-align: center;
  text-decoration: none;
  font-family: 'Inter';
  /* font-size: 13px; */
  /* margin: 5px */
}

.row {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  /* margin: 30px;
  gap: 20px; */
}

.contributions-tabs button {
  border: none;
  background: none;
  font-size: 20px;
  font-family: 'Inter';
  margin: 16px;
  outline: none;
}

.contributions-tabs button:hover {
  cursor: pointer;
}

.selected-tab {
  font-weight: bold;
  color: salmon;
  text-underline-offset: 0.2em;
  text-decoration: underline salmon;
}

.reactions-display {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}
</style>
