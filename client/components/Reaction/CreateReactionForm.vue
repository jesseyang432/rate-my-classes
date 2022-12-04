<!-- Form for creating reactions (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateReactionForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/reactions',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'course', label: 'Course', value: '', placeholder: 'reeeee'},
        {id: 'content', label: 'Content', value: '', placeholder: 'ree'}
      ],
      title: 'Create a Reaction',
      placeholderText: "What's happening in class?",
      buttonText: 'Post',
      refreshReactions: true,
      callback: () => {
        const message = 'Successfully created a reaction!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
