<template>
    <article
      class="course"
    >
      <header>
        <h3 class="name">
          {{ course.name }}
        </h3>
        <span style="text-align:right;" class="header-interact"> 
          <span class="greenDot"></span> &nbsp; {{$store.state.ratings[course.name]}}
          <!-- <EnrollButton v-if="!enrolled" :course="course.name"/>
          <EnrollStatus v-else :course="course.name"/> -->
        </span>
      </header>
      <p class="description">
        {{compress(course.description)}}
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
import EnrollButton from '@/components/Enroll/EnrollButton.vue';
import EnrollStatus from '@/components/Enroll/EnrollStatus.vue';

  export default {
    name: 'CourseComponent',
    components: {EnrollButton, EnrollStatus},
    props: {
      // Data from the stored course
      course: {
        type: Object,
        required: true
      },
      enrolled: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        alerts: {} // Displays success/error messages encountered during course modification
      };
    },
    methods: {
      compress(description) {
        // standardizes course description length
        const words = description.split(" "); 
        if (words.length < 30){
          return description
        }
        const firstWords = words.splice(0,30);
        const firstPart = firstWords.reduce(
          (accumulator, currentValue) => accumulator + " " + currentValue, 
          ""
        ); 
        const output = firstPart + "..."; 
        return output; 
      }
    }
  };
  </script>
  
  <style scoped>
  .course {
      border: 1px solid #111;
      border-radius: 16px;
      padding: 20px;
      position: relative;
  }

  header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-family: 'Inter';
    font-weight: bold;
  }

  .description {
    font-family: 'Inter';
    font-weight: normal;
    
  }
  .header-interact {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

.greenDot {
  height: 15px;
  width: 15px;
  background-color: rgb(20, 131, 24);
  border-radius: 50%;
  display: inline-block;
}
  </style>
  