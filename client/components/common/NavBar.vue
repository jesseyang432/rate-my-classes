<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <h1 class="title">
        Rate My Classes
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        <div class="link">
          Home
        </div>
      </router-link>
      <router-link to="/courses">
        <div class="link">
          Courses
        </div>
      </router-link>
      <router-link v-if="$store.state.username" to="/profile">
        <div @click = "setProfile" class="link">
          Profile
        </div>
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        <div class="link">
          Login
        </div>
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>
<script>
export default {
  methods: {
    async setProfile() {
      this.$store.commit('updateProfile', this.$store.state.username);
    }
  }
}
</script>

<style scoped>
nav {
    padding: 3vw 2vw;
    background-color: salmon;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #A9A9A9;
}

.title {
    margin: 0 5px;
    font-family: 'Inter';
    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
    color: white;
}

.link {
  margin: 0 5px;
  font-family: 'Inter';
  font-weight: normal;
  font-size: 24px;
  color: white;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
