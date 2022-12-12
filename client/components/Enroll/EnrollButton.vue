<!-- Form for creating freets (block style) -->

<template>
    <section>
        <button id="join-button" @click="() => {modalOpen = true;}">
            Join
        </button>
        <section v-if="modalOpen" class="modal-mask">
          <section class="modal-container">
            <header>
              <p>
                Join as...
              </p>
              <button id="modal-close" @click="() => {modalOpen = false;}">
                ❌
              </button>
            </header>
            <div>
              <input type="radio" v-model="joiningAs" value="current">
              <label for="current"> Currently Enrolled</label>
            </div>
            <div>
              <input type="radio" v-model="joiningAs" value="previous">
              <label for="previous"> Previously Enrolled</label>
            </div>
            <div>
              <input type="radio" v-model="joiningAs" value="interested">
              <label for="interested"> Interested</label>
            </div>
            <section class="status-buttons">
              <button @click="submit">
                Join Class
              </button>
            </section>
          </section>
        </section>
    </section>
</template>

<script>
// import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
  name: 'EnrollButton',
  props: {
    course: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      modalOpen: false,
      joiningAs: 'current',
      url: `/api/enroll`,
      method: 'POST',
      hasBody: false,
      title: 'Enroll',
    };
  },
  methods: {
      async submit() {
        /**
          * Submits a form with the specified options from data().
          */
        const options = {
          method: this.method,
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };
        options.body = JSON.stringify(Object.fromEntries([['courseToEnroll', this.course], ['enrollmentType', this.joiningAs]]));

  
        try {
          const r = await fetch(this.url, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }

          // Perform Callback
          this.$store.commit('refreshEnrollments');
          this.modalOpen = false;
          // this.$emit('updatingEnrollment');

          const similarity_options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin' // Sends express-session credentials with request
          };

          const similarity_r = await fetch('/api/similarities', similarity_options);
          if (!similarity_r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await similarity_r.json();
            throw new Error(res.error);
          }

          this.$store.commit('refreshSimilarities');
        } catch (e) {
        }
      }
    }

};
</script>

<style scoped>
section {
    margin: 8px;
}

button {
  border-radius: 8px;
  font-family: 'Inter';
}

label {
  font-weight: normal;
}

#join-button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 8px 12px;
  margin-right: 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-family: 'Inter';
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  margin: 0;
}

.modal-container {
  width: 360px;
  
  margin: auto;
  padding: 0px 16px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  display: flex;
  flex-flow: column wrap;
}

.modal-container header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.modal-container button {
  margin: 16px 8px 4px 8px;
}

.status-buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

.status-buttons button {
  padding: 8px 16px;
  border-radius: 8px;
  background-color: salmon;
  color: white;
  margin: 8px 32px;
}

#modal-close {
  background: none;
  border: none;
  font-size: large;
}

button:hover {
    cursor: pointer;
}
</style>