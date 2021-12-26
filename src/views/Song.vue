<template>
<main>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="newSong(song)"
       class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none">
        <i class="fas" :class="{'fa-play': !isSongPlaying, 'fa-pause': isSongPlaying}"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{song.modified_name}}</div>
        <div>{{song.genre}}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6" id="comments">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{song.comment_count}})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
        :class="comment_alert_style">{{comment_alert_message}}</div>
        <vee-form v-if="userLoggedIn" :validation-schema="schema" @submit="addComment">
          <vee-field as="textarea" name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></vee-field>
            <ErrorMessage name="comment" class="text-red-500" />
          <button :disabled="comment_in_submission" type="submit"
           class="py-1.5 px-3 rounded text-white bg-green-600 block">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li v-for="comment in sortedComments" :key="comment.docID"
     class="p-6 bg-gray-50 border border-gray-200">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{comment.name}}</div>
        <time>{{comment.datePosted}}</time>
      </div>

      <p>
        {{comment.content}}
      </p>
    </li>
  </ul>
  </main>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import {
  getSongByID, getCurrentUser, addComment, getComments, updateCommentCount,
} from '@/includes/firebase';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_style: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted',
      sort: '1',
    };
  },
  computed: {
    ...mapState(['userLoggedIn', 'currentSong']),
    ...mapGetters(['playing']),
    sortedComments() {
      return [...this.comments].sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
    isSongPlaying() {
      return this.song.original_name === this.currentSong.original_name && this.playing;
    },
  },
  async created() {
    const songSnapshot = await getSongByID(this.$route.params.id);
    if (!songSnapshot.exists()) {
      this.$router.push({ name: 'Home' });
      return;
    }
    this.song = songSnapshot.data();
    this.getComments();

    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : '1';
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) return;
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
  methods: {
    ...mapActions(['newSong']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_style = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! Your comment is being submitted';
      const user = getCurrentUser();
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: user.displayName,
        uid: user.uid,
      };
      await addComment(comment);
      this.song.comment_count += 1;
      await updateCommentCount(this.$route.params.id, this.song.comment_count);
      this.comment_in_submission = false;
      this.comment_alert_style = 'bg-green-500';
      this.comment_alert_message = 'Comment added';

      resetForm();
      this.getComments();
    },
    async getComments() {
      this.comments = [];
      const snapshots = await getComments(this.$route.params.id);
      snapshots.forEach((snapshot) => {
        this.comments.push({
          docID: snapshot.id,
          ...snapshot.data(),
        });
      });
    },
  },
};
</script>
