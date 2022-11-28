<!-- Form for creating reactions (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateReviewForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/reviews',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'course', label: 'Course', value: ''},
        {id: 'term', label: 'Term', value: ''},
        {id: 'instructor', label: 'Instructor', value: ''},
        {id: 'hours', label: 'Hours/week', value: ''},
        {id: 'knowledge', label: 'Previous Knowledge', value: ''},
        {id: 'grade', label: 'Grade', value: ''},
        {id: 'content', label: 'Review', value: ''},
        {id: 'difficulty', label: 'Difficulty', value: ''},
        {id: 'overallRating', label: 'Overall Rating', value: ''},

      ],
      title: 'Create a Review',
      refreshReviews: true,
      callback: () => {
        const message = 'Successfully created a review!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
