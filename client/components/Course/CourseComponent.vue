<template>
    <article
      class="course"
    >
      <header>
        <h3 class="name">
          {{ course.name }}
        </h3>
      </header>
      <p class="description">
        {{course.description}}
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
    </article>
  </template>
  
  <script>
  export default {
    name: 'CourseComponent',
    props: {
      // Data from the stored course
      course: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {} // Displays success/error messages encountered during course modification
      };
    },
  };
  </script>
  
  <style scoped>
  .course {
      border: 1px solid #111;
      border-radius: 16px;
      margin: 16px;
      padding: 20px;
      position: relative;
  }
  </style>
  