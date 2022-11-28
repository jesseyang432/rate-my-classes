<!-- Form for creating freets (block style) -->

<template>
    <section>
        <button id="status-button" @click="() => {modalOpen = true;}">
            Enrollment Status
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
              <input type="radio" v-model="status" value="current">
              <label for="current"> Currently Enrolled</label>
            </div>
            <div>
              <input type="radio" v-model="status" value="previous">
              <label for="previous"> Previously Enrolled</label>
            </div>
            <div>
              <input type="radio" v-model="status" value="interested">
              <label for="interested"> Interested</label>
            </div>
            <!-- <button @click="Modify">
              Modify Status
            </button> -->
            <button @click="leave">
              Leave Class
            </button>
          </section>
        </section>
        <section v-else>
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
    }
    // upvoted: {
    //     type: Boolean,
    //     required: true,
    // },
    // freetId: {
    //   type: String,
    //   required: true,
    // },
    // numUpvotes: {
    //     type: Number,
    //     required: true,
    // }
  },
  data() {
    return {
      modalOpen: false,
      status: 'current',
      modifyUrl: '/api/enroll',
      deleteUrl: `/api/enroll/${this.course}`,
      hasBody: false,
      title: 'Enroll',
    };
  },
  methods: {
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
        this.modalOpen = true;

        //   if (this.callback) {
        //     if (this.asyncCallback) {
        //       await this.callback();
        //     } else {
        //       this.callback();
        //     }
        //   }
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
  font-family: 'Times New Roman', Times, serif;
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

#modal-close {
  background: none;
  border: none;
  font-size: large;
}

button:hover {
    cursor: pointer;
}
</style>