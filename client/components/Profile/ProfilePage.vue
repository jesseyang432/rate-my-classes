<!-- Default page that also displays reactions -->

<template>
  <main>

    <div class = "page" v-if="$store.state.username">
      <div class = "sideBar">
        <h2>@{{ $store.state.username }}</h2>
        <article class="info">
          <p><strong>Class Year: </strong>{{$store.state.profile.classYear}}</p>
          <p><strong>Major: </strong>{{$store.state.profile.major}}</p>
        </article>
      </div>

      <div class = "content">
        <h2>Enrolled Courses</h2>
        <section v-if="$store.state.enrollments.length">
          <p v-for="enrollment in $store.state.enrollments" :key="enrollment.id">
            {{enrollment.toCourse.name}}
          </p>
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
}

.page {
  display: flex;
}

.sideBar{
  width: 300px;
}

.content {
  flex: 1 0 auto;
}
</style>
