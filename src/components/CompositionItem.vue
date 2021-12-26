<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div  v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{song.modified_name}}</h4>
      <button @click.prevent="deleteSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times"></i>
      </button>
      <button @click.prevent="toggleForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" :class="alert_style"
        v-if="alert">{{alert}}</div>
      <vee-form @submit="edit" :validation-schema="schema" :initial-values="song">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field type="text" name="modified_name" @input="updateUnsavedChangesFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" />
            <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field type="text" name="genre"  @input="updateUnsavedChangesFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
          Submit
        </button>
        <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="toggleForm">
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { updateSong, deleteSongData, deleteSong } from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateUnsavedChangesFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      alert_style: '',
      alert: '',
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      this.in_submission = false;
      this.alert_style = '';
      this.alert = '';
    },
    async edit(values) {
      this.in_submission = true;
      this.alert_style = 'bg-blue-500';
      this.alert = 'Updating song info';
      try {
        await updateSong(this.song.docID, values);
      } catch (e) {
        this.alert_style = 'bg-red-500';
        this.alert = e.message;
        this.in_submission = false;
        return;
      }
      this.alert_style = 'bg-green-500';
      this.alert = 'Success!';
      this.updateUnsavedChangesFlag(false);
      this.updateSong(this.index, values);
    },
    async deleteSong() {
      await deleteSongData(this.song.docID);
      await deleteSong(this.song.original_name);
      this.removeSong();
    },
  },
};
</script>
