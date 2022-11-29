<template>
    <section>
        <form v-if="!formExpanded">
            <h2>Course Review Form</h2>
            <div class="expand-button">
                <button @click="() => {formExpanded = true;}">+</button>
            </div>
        </form>
        <form v-else @submit.prevent="submit">
            <h2>Course Review Form</h2>
            <div class="expand-button">
                <button @click="() => {formExpanded = false;}">-</button>
            </div>
            <section class="course-info">
                <div class="input-elem">
                    <label for="term">Term Taken: </label>
                    <select required
                    :name="term"
                    v-model="term">
                    <option value="" disabled selected hidden>Term Taken</option>
                    <option value="Fall 2022">Fall 2022</option>
                    <option value="Spring 2022">Spring 2022</option>
                    <option value="Fall 2021">Fall 2021</option>
                    <option value="Spring 2021">Spring 2021</option>
                    <option value="Fall 2021">Fall 2020</option>
                    <option value="Spring 2021">Spring 2020</option>
                    </select>
                </div>
                <div class="input-elem">
                    <label for="instructor">Instructor: </label>
                    <input v-model="instructor">
                </div>
                <div class="input-elem">
                    <label for="hours">Hours/Week: </label>
                    <input v-model="hours" step="0.1" type="number">
                </div>
                <div class="input-elem">
                    <label for="knowledge">Prior Knowledge: </label>
                    <select
                    :name="knowledge"
                    v-model="knowledge">
                    <option value="None">None</option>
                    <option value="Slight">Slight</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    </select>
                </div>
                <div class="input-elem">
                    <label for="grade">Grade: </label>
                    <select
                    :name="grade"
                    v-model="grade">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="F">F</option>
                    </select>
                </div>
            </section>

            
            <h3>Ratings</h3>
            <section class="course-ratings">
                <div class="input-elem">
                    <label for="difficulty">Difficulty <b>({{difficulty}})</b>: </label>
                    <input type="range" v-model="difficulty" min="1" max="5">
                </div>
                <div class="input-elem">
                    <label for="rating">Overall Rating: <b>({{rating}})</b></label>
                    <input type="range" v-model="rating" min="1" max="5">
                </div>
            </section>
            
            <h3>Leave a Review</h3>
            <textarea
            :name="content"
            v-model="content"
            placeholder="Compose your review..."
            />
            <p style="text-align: right;">
                <button
                type="submit"
                >
                    Submit Review
                </button>
            </p>
        </form>
    </section>
    
</template>

<script>
// import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
  name: 'CourseReviewForm',
  props: {
    course: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      formExpanded: false,
      term: null,
      instructor: null,
      hours: null,
      knowledge: null,
      grade: null,
      content: '',
      difficulty: 'Not Rated',
      rating: 'Not Rated'
    };
  },
  methods: {
      async submit() {
        /**
          * Submits a form with the specified options from data().
          */
        console.log(this.term);
        console.log(this.instructor);
        console.log(this.hours);
        console.log(this.knowledge);
        console.log(this.grade);
        console.log(this.content);
        console.log(this.difficulty);
        console.log(this.rating);
        return;

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

        } catch (e) {
        }
      }
    }

};
</script>

<style scoped>
form {
  border: 1px solid #A9A9A9;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  position: relative;
  text-align: center;
}

form h2 {
    margin-top: 8px;
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

section {
    margin: 8px;
}

.expand-button {
    display: flex;
    justify-content: center;
}

.expand-button button {
    width: 36px;
}

.course-info {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
}

.course-ratings {
    display: flex;
    justify-content: space-evenly;
}

.course-ratings input {
    width: 200px;
}

.input-elem label {
    margin: 8px;
}

.input-elem input {
    margin: 4px;
    outline: none;
}

.input-elem select {
    margin: 4px;
    outline: none;
}

textarea {
    outline: none;
}

button {
  border-radius: 8px;
}

button:hover {
    cursor: pointer;
}
</style>