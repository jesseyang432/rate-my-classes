<!-- Form for enrolling in a class -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EnrollForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/enroll',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'courseToEnroll', label: 'Course', value: ''},
      ],
      title: 'Enroll',
      callback: () => {
        this.$store.commit('refreshEnrollments');
      }
    };
  }
};
</script>
