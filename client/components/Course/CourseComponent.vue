<template>
    <article
      class="course"
    >
    <header>
      <section class="title">
        <router-link style="text-decoration: none;" :to="`course/${course.name}`">
          {{ course.name }}
        </router-link>
      </section>
      <span style="text-align:right;" class="header-interact"> 
          <span class="greenDot"></span> &nbsp; {{$store.state.ratings[course.name]}}
        </span>
    </header>
    
    <!-- <header>
        <h3 class="course">
          {{ course.name }}
        </h3>
        <span style="text-align:right;" class="header-interact"> 
          <span class="greenDot"></span> &nbsp; {{$store.state.ratings[course.name]}}
        </span>
    </header> -->

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
  .title {
      font-size: 25px;
      padding: 20px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  /* header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-family: 'Inter';
    font-weight: bold;
  } */

  header {
    display: flex;
    background-color: #fcaca3;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold;
    border-radius: 15px 15px 0px 0px;
    height: 60px;
  }

  .course {
    font-size: small;
    box-shadow: 5px 10px #f2f2f2;
    background-color: white;
    font-family: 'Inter';
    /* position: relative; */
    margin: 32px 32px;

    border-radius: 15px;
    overflow-wrap: break-word;
}

  .description {
    font-family: 'Inter';
    font-size: 15px;
    font-weight: normal;
    padding: 30px;
    margin: 10px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
  }
  .header-interact {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

.greenDot {
  height: 15px;
  width: 15px;
  margin: 20px;
  background-color: rgb(20, 131, 24);
  border-radius: 50%;
  display: inline-block;
}
  </style>
  