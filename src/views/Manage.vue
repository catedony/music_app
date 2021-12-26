<template>
    <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item v-for="(song, i) in songs" :key="song.docID" :song="song"
             :updateSong="updateSong"
             :removeSong="removeSong"
             :updateUnsavedChangesFlag="updateUnsavedChangesFlag"
             :index="i" />
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import AppUpload from '@/components/Upload.vue';
import { getUserSongs, getCurrentUser } from '@/includes/firebase';
import CompositionItem from '../components/CompositionItem.vue';

export default {
  name: 'Manage',
  components: {
    AppUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedChangesFlag: false,
    };
  },
  async created() {
    const snapshot = await getUserSongs(getCurrentUser().uid);
    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].genre = values.genre;
      this.songs[i].modified_name = values.modified_name;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(song) {
      this.songs.push({ docID: song.id, ...song.data() });
    },
    updateUnsavedChangesFlag(value) {
      this.unsavedChangesFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.unsavedChangesFlag) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      next(confirm('You have unsaved changes. Are you sure you want to leave?'));
    } else {
      next();
    }
  },
};
</script>
