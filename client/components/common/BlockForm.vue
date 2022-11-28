<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          placeholder="Compose your message..."
          @input="field.value = $event.target.value"
        />
        <select v-else-if="field.id === 'classYear'" required
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value">
          <option value="" disabled selected hidden>{{ field.label }}</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <select v-else-if="field.id === 'major'" required
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value">
          <option value="" disabled selected hidden>{{ field.label }}</option>
          <option value="6-3">6-3 Computer Science</option>
          <option value="6-2">6-2 EE and Computer Science</option>
          <option value="17">17 Basket Weaving</option>
          <option value="18">18 Mathematics</option>
          <option value="29">29 Bicycle Making</option>
        </select>

        <select v-else-if="field.id === 'courseToEnroll'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value">
          <option
            v-for="course in $store.state.courses"
            :key="course.id"
            :value=course.name
          >
            {{course.name}}
          </option>
        </select>
        <select required v-else-if="field.id === 'course'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value">
          <option value="" disabled selected hidden>{{ field.label }}</option>
          <option
            v-for="course in $store.state.enrollments"
            :key="course.toCourse.id"
            :value=course.toCourse.name
          >
            {{course.toCourse.name}}
          </option>
        </select>
        <input v-else-if = "field.id === 'password'"
          :name="field.id"
          :value="field.value"
          placeholder="Password"
          @input="field.value = $event.target.value"
        >
        <input v-else-if = "field.id === 'username'"
          :name="field.id"
          :value="field.value"
          placeholder="Username"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <p style="text-align: right;">
      <button
      type="submit"
      >
        {{ title }}
      </button>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshReactions: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
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
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshReactions) {
          this.$store.commit('refreshReactions');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #A9A9A9;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

select {
  border: 0px;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: .8em;
  background-color: #F6F6F6;
  margin-top: 10px;
}

select:invalid {
  color: #747574;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  border: 0px;
  border-radius: 20px;
  padding: 8px 12px;
  padding-bottom: 70px;
  font-size: .8em;
  background-color: #F6F6F6;
  margin-top: 10px;
}

textarea::placeholder {
  font-family: "Inter";
}

button {
  border: 0px;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: .8em;
  background-color: #288BFF;
  margin-top: 0px;
  color: white;
  block-size: fit-content;
  width: fit-content;
}

input {
  border: 0px;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: .8em;
  background-color: #F6F6F6;
  margin-top: 10px;
}
</style>
