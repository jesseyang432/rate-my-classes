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
        Home
      </router-link>
      <router-link to="/courses">
        Courses
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
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

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: rgb(255, 255, 255);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-bottom: 1px solid black;
}

.title {
    margin: 0 5px;
    font-family: 'arial';
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 48px;
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
