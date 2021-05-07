import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from 'src/boot/firebase'
import pwrup from './pwrup'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  fb.usersCollection.onSnapshot((snapshot) => {

    const usersArray = []

    snapshot.forEach(doc => {
      const user = doc.data()
      user.id = doc.id
      usersArray.push(user)
    })

    Store.commit('pwrup/setUsers', usersArray)
  }, (error) => {
    Store.commit('pwrup/setError', error)
  })

  fb.postsCollection.orderBy('publishedAt', 'desc').onSnapshot(snapshot => {
    const postsArray = []

    snapshot.forEach(doc => {
      const post = doc.data()
      post.id = doc.id

      postsArray.push(post)
    })

    Store.commit('setPosts', postsArray)
  }, (error) => {
    Store.commit('pwrup/setError', error)
  })

  fb.commentsCollection.onSnapshot((snapshot) => {

    const commentsArray = []

    snapshot.forEach(doc => {
      const comment = doc.data()
      comment.id = doc.id

      commentsArray.push(comment)
    })

    Store.commit('setComments', commentsArray)
  }, (error) => {
    Store.commit('pwrup/setError', error)
  })

  const Store = new Vuex.Store({
    state: {
      posts: [],
      comments: []
    },
    modules: {
      // then we reference it
      pwrup
    },
    mutations: {
      setPosts (state, posts) {
        state.posts = posts
      },
      setComments (state, comments) {
        state.comments = comments
      }
    },
    getters: {
    },
    actions: {
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./pwrup'], () => {
      const newPwrup = require('./pwrup').default
      Store.hotUpdate({ modules: { pwrup: newPwrup } })
    })
  }

  return Store
}
