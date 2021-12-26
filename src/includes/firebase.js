// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,

} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytesResumable, deleteObject, getDownloadURL,
} from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCDcs2x8Q3GuEYS-vC2noa8hJOu8mil2Jo',
  authDomain: 'music-e1fe0.firebaseapp.com',
  projectId: 'music-e1fe0',
  storageBucket: 'music-e1fe0.appspot.com',
  appId: '1:1037519549273:web:7e92051c407bebaf711248',
};
// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const getCurrentUser = () => auth.currentUser;
const createUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
const db = getFirestore();
// const usersCollection = collection(db, 'users');
// const addUserData = (data) => addDoc(usersCollection, data);
const addUserData = (id, data) => {
  const userDoc = doc(db, 'users', id);
  setDoc(userDoc, data);
};
/**
 *
 * @param {{
 * uid: Number,
 * user_name: String,
 * original_name: String,
 * modified_name: String,
 * genre: String,
 * comment_count: Number,
 * url: String
 * }} song
 */
const songsCollection = collection(db, 'songs');
const addSongData = (song) => addDoc(songsCollection, song);

const authStateChangeHandle = (callback) => onAuthStateChanged(auth, callback);

const storage = getStorage();
const homeRef = ref(storage);
const songsRef = ref(homeRef, '/songs');
/**
 * @param {String} fileName
 * @param {File} file
 */
const uploadSongs = (fileName, file) => {
  const songRef = ref(songsRef, `/${fileName}`);
  return uploadBytesResumable(songRef, file);
};
/**
 *
 * @param {Number} userId
 * @returns {Promise<[]>}
 */
const getUserSongs = (userId) => {
  const q = query(songsCollection, where('uid', '==', userId));
  return getDocs(q);
};
const getSongByID = (docID) => {
  const docRef = doc(songsCollection, docID);
  return getDoc(docRef);
};
const getSongURL = (fileName) => {
  const songRef = ref(songsRef, `/${fileName}`);
  return getDownloadURL(songRef);
};
const getSongs = (n = 30, lastLoadedSong) => {
  const q = lastLoadedSong ? query(songsCollection, orderBy('modified_name'), startAfter(lastLoadedSong), limit(n)) : query(songsCollection, orderBy('modified_name'), limit(n));
  return getDocs(q);
};

const updateSong = (id, data) => {
  const songRef = doc(songsCollection, id);
  return updateDoc(songRef, data);
};
const deleteSongData = (id) => deleteDoc(doc(songsCollection, id));
const deleteSong = (fileName) => {
  const songRef = ref(songsRef, `/${fileName}`);
  deleteObject(songRef);
};

const commentsCollection = collection(db, 'comments');
const addComment = (comment) => addDoc(commentsCollection, comment);
const getComments = (songId) => {
  const q = query(commentsCollection, where('sid', '==', songId));
  return getDocs(q);
};
const updateCommentCount = (songId, count) => {
  const songRef = doc(songsCollection, songId);
  return updateDoc(songRef, { comment_count: count });
};
export {
  auth,
  getCurrentUser,
  createUser,
  addUserData,
  addSongData,
  updateProfile,
  authStateChangeHandle,
  signIn,
  uploadSongs,
  getUserSongs,
  getSongs,
  updateSong,
  deleteSongData,
  deleteSong,
  getDoc,
  getSongByID,
  addComment,
  getComments,
  updateCommentCount,
  getSongURL,
};
