<template>
    <article
      class="course"
    >
    <header>
      <div v-if="course.name.startsWith('6.')"
        class="header-6">
        <section class="title">
          <router-link style="text-decoration: none;" :to="`course/${course.name}`">
            <div class="link">
              {{ course.name }}
          </div>
          </router-link>
        </section>
        <!-- <span style="text-align:right;" class="header-interact"> 
            <span class="greenDot"></span> &nbsp; {{$store.state.ratings[course.name]}}
          </span> -->
      </div>
      <div v-if="course.name.startsWith('14.')"
        class="header-14">
        <section class="title">
          <router-link style="text-decoration: none;" :to="`course/${course.name}`">
            <div class="link">
              {{ course.name }}
          </div>
          </router-link>
        </section>
        <!-- <span style="text-align:right;" class="header-interact"> 
            <span class="greenDot"></span> &nbsp; {{$store.state.ratings[course.name]}}
          </span> -->
      </div>
      <div v-if="course.name.startsWith('18.')"
        class="header-18">
        <section class="title">
          <router-link style="text-decoration: none;" :to="`course/${course.name}`">
            <div class="link">
              {{ course.name }}
          </div>
          </router-link>
        </section>
        <!-- <span style="text-align:right;" class="header-interact"> 
            <span class="greenDot"></span> &nbsp; {{$store.state.ratings[course.name]}}
          </span> -->
      </div>
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
        Description:
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
    computed: {
        rating() {
            return this.$store.state.ratings[this.course.name];
            const val = this.$store.state.ratings[this.course.name];
            return val ? ((Math.round(rating*10))/10) : val;
        }
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
      },

      Round(rating){
        // rounds number to 1 decimal place
        if (rating){
          return ((Math.round(rating*10))/10); 
        }
        return rating; 
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
      font-family: "Inter";
      
  }

  /* header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-family: 'Inter';
    font-weight: bold;
  } */

  .header-6 {
    display: flex;
    background-color: lightsalmon;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold;
    border-radius: 15px 15px 0px 0px;
    height: 60px;
  }

  .header-18 {
    display: flex;
    background-color: lightpink;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Inter';
    font-weight: bold;
    border-radius: 15px 15px 0px 0px;
    height: 60px;
  }

  .header-14 {
    display: flex;
    background-color: lightblue;
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
    background-color: white;
    font-family: 'Inter';
    /* position: relative; */
    margin: 32px 32px;
    box-shadow: 7px 7px #f2f2f2;

    border-radius: 15px;
    border-color: #A9A9A9; 
    border-width: 1px; 
    /*border-style: solid; */
    overflow-wrap: break-word;
}

.link {
  margin: 0 5px;
  font-family: 'Inter';
  font-weight: normal;
  font-size: 24px;
  color: white;
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
    margin: 20px; 
    font-size: 15px;
  }

.greenDot {
  height: 15px;
  width: 15px;
  margin: 10px;
  background-color: rgb(20, 131, 24);
  border-radius: 50%;
  display: inline-block;
}
  </style>
  