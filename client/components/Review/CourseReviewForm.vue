<template>
    <section>
        <form v-if="!editing && !formExpanded">
            <section>
                <header>
                    <h2>Course Review Form</h2>
                </header>
                <div class="expand-button">
                    <button @click="() => {formExpanded = true;}">Start</button>
                </div>
            </section>
        </form>
        <form v-else @submit.prevent="submit">
            <section v-if="!editing">
                <header>
                    <h2>Course Review Form</h2>
                </header>
            </section>
            <section class="course-info">
                <div class = "group">
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
                </div>

                <div class = "group">
                    <div class="input-elem">
                        <label for="hours">Hours/Week: </label>
                        <input v-model="hours" min="0" step="0.1" type="number">
                    </div>
                    <div class="input-elem">
                        <label for="knowledge">Previous Experience: </label>
                        <select
                        :name="knowledge"
                        v-model="knowledge">
                        <option value="None">None</option>
                        <option value="Slight">Slight</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <div class = "group">
                    <div class="input-elem">
                        <label for="grade">Grade Received: </label>
                        <select
                        :name="grade"
                        v-model="grade">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                        </select>
                    </div>
                </div>
            </section>
            <div>
                <header>
                    <h3>Ratings</h3>
                </header>
                <!-- <p>
                    <em>A '*' rating indicates that no rating has been provided (all ratings are optional except Overall Rating, which is required)</em>
                </p> -->
                <section class="course-ratings">
                    <div class="input-elem">
                        <label for="difficulty">Difficulty <b>({{difficulty}})</b>: </label>
                        <RatingComponent :stars="difficulty" v-on:rate="(stars) => this.difficulty = stars"/>
                        <!-- <input type="range" v-model="difficulty" min="1" max="5"> -->
                    </div>
                    <div class="input-elem">
                        <label for="rating">Overall Rating<em>*</em>: <b>({{rating}})</b></label>
                        <RatingComponent :stars="rating" v-on:rate="(stars) => this.rating = stars"/>
                        <!-- <input type="range" v-model="rating" min="1" max="5" required> -->
                    </div>
                </section>
            </div>
            <p class="required-ratings"><em>*Required</em></p>
            <header>
                <h3>Review</h3>
            </header>
            <textarea
            :name="content"
            v-model="content"
            placeholder="Share your thoughts!"
            />
            <p v-if="!editing" style="text-align: right;">
                <button style = "margin-right: 20px;" @click="() => {formExpanded = false;}">Cancel</button>
                <button
                type="submit"
                >
                    Submit Review
                </button>
            </p>
            <p v-else style="text-align: right;">
                <button
                type="submit"
                >
                    Edit Review
                </button>
            </p>
        </form>
    </section>
    
</template>

<script>
// import ButtonForm from '@/components/common/ButtonForm.vue';
import RatingComponent from '@/components/Review/RatingComponent.vue';

export default {
  name: 'CourseReviewForm',
  components: {RatingComponent},
  props: {
    course: {
      type: Object,
      required: true,
    },
    review: {
      type: Object,
      required: false,
    },
    editing: {
      type: Boolean,
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
      difficulty: 0,
      rating: 3,
      maxRating: 5,
      method: 'POST',
      url: `/api/reviews/${this.course.name}`
    };
  },
  created() {
    if (this.review) {
        this.term = this.review.term ? this.review.term : null;
        this.instructor = this.review.instructor ? this.review.instructor: null;
        this.hours = this.review.hours ? this.review.hours : null;
        this.knowledge = this.review.knowledge ? this.review.knowledge: null;
        this.grade = this.review.grade ? this.review.grade : null;
        this.content = this.review.content ? this.review.content : '';
        this.difficulty = this.review.difficulty !== '*' ? this.review.difficulty : '*';
        this.rating = this.review.overallRating;
    }
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
        // return;

        if (this.editing) {
            this.method = 'PATCH';
            this.url = `/api/reviews/${this.review._id}`;
        } else {
            this.method = 'POST';
            this.url = `/api/reviews/${this.course.name}`;
        }

        const options = {
          method: this.method,
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };
        options.body = JSON.stringify(Object.fromEntries([
            ['term', this.term],
            ['instructor', this.instructor],
            ['hours', this.hours],
            ['knowledge', this.knowledge],
            ['grade', this.grade],
            ['content', this.content],
            ['difficulty', this.difficulty],
            ['overallRating', this.rating]]));

  
        try {
          const r = await fetch(this.url, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }

          // Perform Callback
          this.$store.commit('refreshReviews');
          this.$store.commit('refreshSimilarities');
          this.$store.commit('refreshCourses');
          this.$emit('stopEditing');
          this.formExpanded = false;

        } catch (e) {
        }
      },
      rate(star) {
        console.log(star);
        console.log(this.maxStars);
        console.log(star <= this.maxStars);
        console.log(star >= 0);
        if (star <= this.maxRating && star >= 0) {
            console.log('huh');
            this.stars = this.stars === star ? star - 1 : star;
            console.log(this.stars);
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

header {
    font-family: "Inter";
    font-weight: bold;
}

label {
    font-family: "Inter";
    font-weight: normal;
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

.rating:hover .star {
    color: #f3d23e;
}

.star {
    display: inline-block;
    cursor: pointer;
}

.star:hover~.star:not(.active) {
    color: inherit;
}

.active {
    color: #f3d23e;
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
    width: 70px;
}

.course-info {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 120px;
}

.group {
    border-radius: 20px;
    opacity: 1.0;
    background-color: rgba(255, 160, 122, 0.2);
    font-size: 16px;
}

select, input {
  border-radius: 10px;
  padding: 8px 12px;
  font-size: .8em;
  background-color: #ffffff;
  margin-top: 10px;
  border-width: 1px;
  border-color: black;
}

.course-ratings {
    display: flex;
    justify-content: center;
    background-color: rgba(255, 160, 122, 0.2);
    border-radius: 20px;
    font-size: 16px;
}

.course-ratings input {
    width: 200px;
}

.input-elem {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8px;
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

.required-ratings {
    font-size: small;
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