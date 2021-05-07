export function setUserProfile (state, user) {
  state.userProfile = user
}

export function setUsers (state, users) {
  state.users = users
}

export function setError (state, error) {
  state.errors = error
}

// Post related functions
export function postAdded (state, { docRef }) {
  state.userProfile['posts'] = []
  state.userProfile.posts.push(docRef.id)
}
