<!-- Form for creating freets (block style) -->

<template>
    <section>
        <button id="status-button" @click="() => {modalOpen = true;}">
            {{display}}
        </button>
        <section v-if="modalOpen" class="modal-mask">
          <section class="modal-container">
            <header>
              <p>
                Modify your enrollment status...
              </p>
              <button id="modal-close" @click="() => {modalOpen = false;}">
                ❌
              </button>
            </header>
            <div>
              <input type="radio" v-model="enrollmentType" value="current">
              <label for="current"> Currently Enrolled</label>
            </div>
            <div>
              <input type="radio" v-model="enrollmentType" value="previous">
              <label for="previous"> Previously Enrolled</label>
            </div>
            <div>
              <input type="radio" v-model="enrollmentType" value="interested">
              <label for="interested"> Interested</label>
            </div>
            <section class="status-buttons">
              <button @click="modify">
                Modify Status
              </button>
              <button @click="leave">
                Leave Class
              </button>
            </section>
          </section>
        </section>
    </section>
</template>

<script>
// import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
  name: 'EnrollStatus',
  props: {
    course: {
      type: String,
      required: true,
    },
    enrollmentType: {
        type: String,
        required: true,
    }
  },
  data() {
    return {
      display: this.enrollmentType === 'current' ? 'Currently Enrolled' : (this.enrollmentType === 'previous' ? 'Previously Enrolled' : 'Interested'),
      modalOpen: false,
      modifyUrl: `/api/enroll/${this.course}`,
      deleteUrl: `/api/enroll/${this.course}`,
      hasBody: false,
      title: 'Enroll',
    };
  },
  methods: {
      async modify() {
        const options = {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };

        options.body = JSON.stringify(Object.fromEntries([['enrollmentType', this.enrollmentType]]));

        try {
          const r = await fetch(this.modifyUrl, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }

            // Perform Callback
            this.$store.commit('refreshEnrollments');
            this.modalOpen = false;
            this.display = this.enrollmentType === 'current' ? 'Currently Enrolled' : (this.enrollmentType === 'previous' ? 'Previously Enrolled' : 'Interested')
            // this.$emit('updatingEnrollment');

        } catch (e) {
        }
      },
      async leave() {
        const options = {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };

        try {
          const r = await fetch(this.deleteUrl, options);
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
  /* background: none; */
  border-radius: 8px;
  font-family: 'Inter';
}

label {
  font-weight: normal;
}

#status-button {
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
  width: 400px;
  
  margin: auto;
  padding: 0px 16px 16px 16px;
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
  justify-content: space-between;
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