<!-- Form for creating freets (block style) -->

<template>
    <section>
        <button @click="() => {modalOpen = true;}">
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
              <input type="checkbox" :onclick="myFunction"> Currently Enrolled
            </div>
            <div>
              <input type="checkbox" :onclick="myFunction"> Previously Enrolled
            </div>
            <div>
              <input type="checkbox" :onclick="myFunction"> Interested
            </div>
            <button>
              Join Class
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
  name: 'UpvoteForm',
  props: {
    upvoted: {
        type: Boolean,
        required: true,
    },
    freetId: {
      type: String,
      required: true,
    },
    numUpvotes: {
        type: Number,
        required: true,
    }
  },
  data() {
    return {
      modalOpen: false,
      url: `/api/upvotes/${this.freetId}`,
      method: 'POST',
      hasBody: false,
      title: 'Upvote',
      //numUpvotes: 0,
      callback: () => {
        this.$emit('upvote');
      }
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
        if (this.hasBody) {
          const optionsEntries = this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            });
          options.body = JSON.stringify(Object.fromEntries(optionsEntries));
        }
  
        try {
          const r = await fetch(this.url, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }

          if (this.callback) {
            if (this.asyncCallback) {
              await this.callback();
            } else {
              this.callback();
            }
          }
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
  width: 300px;
  
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