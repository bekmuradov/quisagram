import * as fb from '../../boot/firebase'
import firebase from 'firebase/app'

export function likePost ({ state }, post) {
  // set authenticate user
  const userId = state.userProfile.userId
  // creare document and set in variable for reference
  const likeRef = fb.likesCollection.doc()
  likeRef.set({
    'postId': post.id,
    'userId': userId
  })
  // find post to like
  const postDoc = fb.postsCollection.doc(post.id)
  // delete of user who liked the post
  delete post.reactions.likes[userId]
  // update the post fields
  postDoc.update({
    reactions: {
      likes: {
        ...post.reactions.likes,
        [userId]: {
        'isLiked': true,
        'likeDocId': likeRef.id
        }
      },
      likesCount: post.reactions.likesCount + 1
    }
  })
}

export function unLikePost ({ state }, post) {
  // set authenticated user
  const userId = state.userProfile.userId
  // find and delete document in likes collection
  fb.likesCollection.doc(post.reactions.likes[userId].likeDocId).delete()
  // delete field of user who liked the post
  delete post.reactions.likes[userId]
  // find post to unlike
  const postDoc = fb.postsCollection.doc(post.id)
  postDoc.update({
    reactions: {
      likes: {
        ...post.reactions.likes
      },
      likesCount: post.reactions.likesCount - 1
    }
  })
}

export function likeComment ({ state }, comment) {
  // set authenticate user
  const userId = state.userProfile.userId
  // find comment to like in comments collection
  const commentDoc = fb.commentsCollection.doc(comment.id)
  // delete user if liked the comment
  delete comment.reactions.likes[userId]
  // update the comment fields
  commentDoc.update({
    reactions: {
      likes: {
        ...comment.reactions.likes,
        [userId]: {
        'isLiked': true
        }
      },
      likesCount: comment.reactions.likesCount + 1
    }
  })
}

export function unLikeComment ({ state }, comment) {
  // set authenticated user
  const userId = state.userProfile.userId
  // delete field of user who liked the comment
  delete comment.reactions.likes[userId]
  // find comment to unlike
  const commentDoc = fb.commentsCollection.doc(comment.id)
  commentDoc.update({
    reactions: {
      likes: {
        ...comment.reactions.likes
      },
      likesCount: comment.reactions.likesCount - 1
    }
  })
}

export function addComment ({ commit }, { comment } ) {
  const commentRef = fb.commentsCollection.doc()
  commentRef.set( comment )
  const postRef = fb.postsCollection.doc(comment.postId)
  postRef.update({
    comments: firebase.firestore.FieldValue.arrayUnion(commentRef.id)
  }).catch((error) => {
    commit('setError', error)
  })
}

export function deleteComment ({ commit }, { comment }) {
  // find and delete comment in comments collection
  fb.commentsCollection.doc(comment.id).delete()
  // remove comment id from post
  fb.postsCollection.doc(comment.postId).update({
    comments: firebase.firestore.FieldValue.arrayRemove(comment.id)
  }).catch((error) => {
    commit('setError', error)
  })
}

export function addPost ({ commit }, { post }){
  // Add a new document with a generated id.
  fb.postsCollection.add(post)
  .then((docRef) => {
    commit('postAdded', { docRef })
  })
  .catch((error) => {
    commit('setError', error)
  })
}

export function deletePost ({ commit }, { post }) {
  // delete all likes from likes collection related to this post
  fb.likesCollection.where('postId', '==', post.id).get()
    .then((querySnapshot) => {
      let batch = fb.db.batch()

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })

      return batch.commit()
    })
    .catch((error) => commit('setError', error))
  // delete all commments from comments collection related to post
  fb.commentsCollection.where('postId', '==', post.id).get()
    .then((querySnapshot) => {
      let batch = fb.db.batch()

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })

      return batch.commit()
    })
    .catch((error) => commit('setError', error))
  // delete image from firebase storage
  fb.storage.ref().child(post.imgName).delete()
    .catch((error) => commit('setError', error))

  // then find and delete post in posts collection
  fb.postsCollection.doc(post.id).delete()
}

export function followFriend ({ state, dispatch }, friend) {
  const user = state.userProfile
  // update user following field with friend to follow
  fb.usersCollection.doc(user.userId).update({
    following: {
      ...user.following,
      [friend.userId] : true
    }
  })
  // update friend followers field with user who follewed him
  fb.usersCollection.doc(friend.userId).update({
    followers: {
      ...friend.followers,
      [user.userId] : true
    }
  })
  dispatch('fetchUserProfile', fb.auth.currentUser)
}

export function unFollowFriend ({ state, dispatch }, friend) {
  const user = state.userProfile
  delete user.following[friend.userId]
  fb.usersCollection.doc(user.userId).update({
    following: {
      ...user.following
    }
  })

  delete friend.followers[user.userId]
  fb.usersCollection.doc(friend.userId).update({
    followers: {
      ...friend.followers
    }
  })
  dispatch('fetchUserProfile', fb.auth.currentUser)
}

export function authAction({ dispatch }) {
  fb.auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch('fetchUserProfile', user)
    } else {
      dispatch('fetchUserProfile', null)
    }
  })
}

export function authUser({ dispatch }) {
  const authId = fb.auth.currentUser.uid
  fb.usersCollection.doc(authId).onSnapshot((doc) => {
    // fetch user profile and set in state
    dispatch('fetchUserProfile', doc.data())
  })
}

export function signOutAction({ commit }) {
  fb
    .auth
    .signOut()
    .then(() => {
      commit('setUserProfile', {})
      this.$router.push('/login')
    })
    .catch(error => {
      commit('setError', error)
    })
}

export function fetchUserProfile({ commit }, user) {
  // fetch user
  fb.usersCollection.doc(user.uid).get()
  .then(userProfile => {
    // set user profile in state
    commit('setUserProfile', userProfile.data())
  })

  if (this.$router.currentRoute.path === '/login') this.$router.push('/')
}
