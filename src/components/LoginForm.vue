<template>
    <!-- Login Form -->
  <div v-if="message" class="p-5" :class="alertStyle">{{ message }}</div>
  <vee-form  :validation-schema="schema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
      <error-message name="email" class="text-red-500" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field type="password" name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
        <error-message name="password" class="text-red-500" />
    </div>
    <button type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      schema: {
        email: 'required|email',
        password: 'required|min:5|max:10',
      },
      isFormSubmitting: false,
      message: '',
    };
  },
  computed: {
    alertStyle() {
      return this.isFormSubmitting ? 'bg-blue-100' : 'bg-red-100';
    },
  },
  methods: {
    async login(data) {
      this.isFormSubmitting = true;
      this.message = 'The request is being processed';
      try {
        await this.$store.dispatch('login', data);
        window.location.reload();
      } catch (e) {
        this.isFormSubmitting = false;
        this.message = e.message;
        console.log(e);
      }
    },
  },
};
</script>
