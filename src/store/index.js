import { createStore } from 'vuex';
import { Howl } from 'howler';
import {
  auth, createUser, addUserData, updateProfile, signIn, getSongURL,
} from '@/includes/firebase';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, song) {
      state.currentSong = song;
      state.sound = new Howl({
        src: [song.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  getters: {
    playing(state) {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  actions: {
    async register({ commit }, user) {
      const userCred = await createUser(user.email, user.password);
      await updateProfile(userCred.user, { displayName: user.name });
      await addUserData(userCred.user.uid, {
        name: user.name, email: user.email, age: user.age, country: user.country,
      });
      commit('toggleAuth');
    },
    async login({ commit }, { email, password }) {
      await signIn(email, password);
      commit('toggleAuth');
    },
    async logout({ commit }) {
      await auth.signOut();
      commit('toggleAuth');
      window.location.reload();
    },
    initLogin({ commit }) {
      if (auth.currentUser) commit('toggleAuth');
    },
    async newSong({ commit, state, dispatch }, song) {
      if (state.currentSong.original_name === song.original_name) {
        dispatch('toggleAudio');
        return;
      }
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      const url = await getSongURL(song.original_name);

      commit('newSong', { ...song, url });
      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) return;
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) return;
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;
      state.sound.seek(seconds);
      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
  modules: {
  },
});
