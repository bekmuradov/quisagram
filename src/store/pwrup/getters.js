export function authUser (state, getters, rootState) {
  const user = state.userProfile
  if (!user) return null
  return {
    ...user,
    get posts () {
      return rootState.posts.filter(post => post.userId === user.userId)
    },
    get postsCount () {
      return this.posts.length
    },
    get likesCount () {
      let likesSum = 0
      for (const post of this.posts) {
        likesSum += post.reactions.likesCount
      }
      return likesSum
    },
    get followersArr () {
      let followersArr = []
      for (const follower in user.followers) {
        followersArr.push(follower)
      }
      return followersArr
    },
    get followingArr () {
      let followingArr = []
      for (const following in user.following) {
        followingArr.push(following)
      }
      return followingArr
    }
  }
}

export function isUserAuth(state) {
  return !!state.userProfile
}

export function getError(state) {
  console.log('from getters ', state.errors)
  return state.errors
}

