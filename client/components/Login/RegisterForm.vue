<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''},
        {id: 'classYear', label: 'Class Year', value: ''},
        {id: 'major', label: 'Major', value: ''},
      ],
      title: 'Create account',
      buttonText: 'Create account',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Reactions'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
