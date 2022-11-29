<!-- Default page that also displays reactions -->

<template>
  <main>

    <div class = "page" v-if="$store.state.username">
      <div class = "sideBar">
        <h2>@{{ $store.state.username }}</h2>
        <article class="info">
          <p><strong>Class Year: </strong>{{$store.state.profile.classYear}}</p>
          <p><strong>Major: </strong>{{$store.state.profile.major}}</p>
          <p><strong>Revews: </strong></p>
          <p><strong>Reactions: </strong></p>
        </article>
        <article class="info">
          <p><strong>Current Courses: </strong></p>
          <div v-for="enrollment in $store.state.enrollments" v-if="enrollment.type === 'current'" :key="enrollment.toCourse.id" id = "status-button">
            <router-link class="course-page-link" :to="`course/${enrollment.toCourse.name}`">
              {{enrollment.toCourse.name}}
            </router-link>
          </div>
        </article>

        <article class="info">
          <p><strong>Interest Courses: </strong></p>
          <div v-for="enrollment in $store.state.enrollments" v-if="enrollment.type === 'interested'" :key="enrollment.toCourse.id" id = "status-button">
            <router-link class="course-page-link" :to="`course/${enrollment.toCourse.name}`">
              {{enrollment.toCourse.name}}
            </router-link>
          </div>
        </article>

        <article class="info">
          <p><strong>Previous Courses: </strong></p>
          <div v-for="enrollment in $store.state.enrollments" v-if="enrollment.type === 'previous'" :key="enrollment.toCourse.id" id = "status-button">
            <router-link class="course-page-link" :to="`course/${enrollment.toCourse.name}`">
              {{enrollment.toCourse.name}}
            </router-link>
          </div>
        </article>
      </div>

      <div class = "content">
        <h2>Enrolled Courses</h2>
        <section v-if="$store.state.enrollments.length">
          <CourseComponent v-for="enrollment in $store.state.enrollments"
            :key="enrollment.toCourse.id"
            :course="enrollment.toCourse"
            :enrolled="isEnrolled(enrollment.toCourse.name)"
          />
        </section>
      </div>
      
      
      <div>
        <router-link to="/account">
          Account Settings
        </router-link>
      </div>
    </div>
  </main>
</template>

<script>
import CourseComponent from '@/components/Course/CourseComponent.vue';
import EnrollForm from '@/components/Enroll/EnrollForm.vue';

export default {
  name: 'ProfilePage',
  components: {CourseComponent, EnrollForm},
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

#status-button {
  border-radius: 8px;
  background-color: #e7e7e7;
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

</style>
