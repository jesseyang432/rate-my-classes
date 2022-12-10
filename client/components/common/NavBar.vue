<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav :class="$store.state.username ? 'expanded-nav' : 'unexpanded-nav'">
    <div class="left">
      <router-link style="text-decoration: none;" to="/">
        <h1 class="title">
          Rate My Classes
        </h1>
      </router-link>
    </div>
    <div class="right">
      <router-link style="text-decoration: none;" to="/">
        <div class="link">
          Home
        </div>
      </router-link>
      <router-link style="text-decoration: none;"  to="/courses">
        <div class="link">
          Courses
        </div>
      </router-link>
      <section class="user-modification" v-if="$store.state.username">
        <router-link style="text-decoration: none;" :to="`/profile/${$store.state.username}`">
        <div @click = "setProfile" class="link2">
          Profile
        </div>
        </router-link>
        <section class="log-out" @click="logout">
          <em>Log Out</em>
        </section>
      </section>
      <router-link style="text-decoration: none;" 
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
    },
    async logout() {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      try {
        const r = await fetch('/api/users/session', options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }
        const text = await r.text();
        const res = text ? JSON.parse(text) : {user: null};
        this.$store.commit('setUsername', res.user ? res.user.username : null);
        this.$router.push({name: 'Reactions'}); // Goes to Home page after signing out
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
  
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>

<style scoped>
nav {
    background-color: salmon;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #A9A9A9;
}

.expanded-nav {
  padding: 1vw 2vw;
}

.unexpanded-nav {
  padding: 3vw 2vw;
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

.link2 {
  border: 2px solid white;
  border-radius: 5px;
  padding: 10px;
  font-family: 'Inter';
  font-weight: normal;
  font-size: 24px;
  font-weight: bold;
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
    /* align-items: flex-start; */
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.user-modification {
  padding-top: 6px;
}

.log-out {
  /* position: fixed;s */
  margin: 12px 8px 0px 0px;
  text-align: right;
  font-family: 'Inter';
  font-size: 16px;
  color: white;
}

.log-out:hover {
  cursor: pointer;
}

.alerts {
    width: 25%;
}
</style>
