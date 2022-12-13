<!-- Default page that also displays freets -->

<template>
  <main>
    <h1 id="title">FAQs</h1>
    <h1>What is a reaction?</h1>
    <p>Want to rant about how hard your last pset was, complain about the exam's grading, or just compliment how well lecture was taught? Reactions are a means of leaving short (&lt 140 characters), informal comments on a course. Students can leave reactions for any course they're currently enrolled in, and our home page provides a quick and accessible view into how students are reacting to the courses they're in.</p>
    <h1>What is a review?</h1>
    <p>Reviews are found on each course's page and are a means of leaving feedback and ratings on courses you've taken previously, or learning from other's experiences in courses you might be interested in. Aside from providing an overall rating for the course, you can choose to provide details on things like hours per week, difficulty, and leave written feedback on the course if you want. You can leave at most one review per class you've previously taken, but can edit your ratings or written review at any point.</p>
    <h1>What is similarity score and how is it calculated?</h1>
    <p>You might notice a similarity score tag under reviews of other students. This number is meant to give some indication on a scale of 100 of how similar you might expect your experience with courses to be as this student. This value is calculated by weighting both the number of shared classes the two of you have or have had and how similarly the two of you have rated classes in the past.</p>
  </main>
</template>

<script>

export default {
  name: 'FAQPage',
  data() {
    return {
      filter: ''
    };
  },
  methods: {
  }
};
</script>

<style scoped>

main {
  margin: 64px 128px 64px 32px;
  font-family: 'Inter';
}

h1 {
  color: salmon;
}

#title {
  font-size: 64px;
  color: black;
}

</style>
