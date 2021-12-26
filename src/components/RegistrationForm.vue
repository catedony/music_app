<template>
  <!-- Registration Form -->
  <div v-if="message" class="p-5" :class='alertStyle'>{{ message }}</div>
  <vee-form :validation-schema="schema"
    :initial-values="initialValues" @submit="register">

    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field type="text" name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
        <error-message class="text-red-500" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
      <error-message name="email" class="text-red-500" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field type="number" name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded" />
      <error-message name="age" class="text-red-500" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field v-slot="{field, errors}" :bails="false" name="password"
        >
        <input v-bind="field" type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
        <div class="text-red-500" v-for="error in errors" :key="error">{{error}}</div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field type="password" name="passwordConfirmation"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
      <error-message name="passwordConfirmation" class="text-red-500" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select" name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <error-message name="country" class="text-red-500" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field type="checkbox" name="tos" :value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <label class="inline-block">Accept terms of service</label>
      <error-message name="tos" class="text-red-500" />
    </div>
    <button type="submit" :disabled="isFormSubmitting"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>

export default {
  name: 'RefistrationForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email',
        age: 'required|min_value:16, max_value:100',
        password: 'required|min:5|max:10',
        passwordConfirmation: 'required|password_mismatch:@password',
        country: 'required|country_excluded:Antarctica',
        tos: 'tos',

      },
      initialValues: {
        country: 'USA',
      },
      isFormSubmitting: false,
      message: '',
      alertStyle: '',
    };
  },
  methods: {
    async register(data) {
      this.isFormSubmitting = true;
      this.alertStyle = 'bg-blue-100';
      this.message = 'The request is being processed';
      try {
        await this.$store.dispatch('register', data);
        window.location.reload();
      } catch (e) {
        this.alertStyle = 'bg-red-100';
        this.message = e.message;
        console.log(e);
      } finally {
        this.isFormSubmitting = false;
      }
    },
  },
};
</script>
