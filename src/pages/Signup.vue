<template>
  <q-page class="flex flex-center column">
    <div class="inputField column q-pa-lg">
      <div class="q-mb-md row justify-center">
        <span class="text-cookie text-h3">Quisagram</span>
        <span
          class="text-h6 text-grey-7 q-mt-md text-center"
          style="line-height: 1;"
          >Sign up to see photos from your friends.</span
        >
      </div>
      <div>
        <q-form action="" class="form" @submit.prevent="validate">
          <q-input
            ref="fullName"
            v-model="user.fullName"
            outlined
            dense
            filled
            placeholder="Name and surname"
            type="text"
            bg-color="#fafafa"
            borderless
            class="q-py-sm"
            @input="isPresent"
          />
          <q-input
            v-model="user.username"
            outlined
            dense
            filled
            placeholder="username"
            type="text"
            bg-color="#fafafa"
            borderless
            class="q-py-sm"
            @input="isPresent"
          />
          <q-input
            ref="email"
            v-model="user.email"
            outlined
            dense
            filled
            placeholder="Email"
            type="email"
            bg-color="#fafafa"
            borderless
            class="q-py-sm"
            autocomplete
            @input="isPresent"
          />
          <q-input
            ref="password"
            v-model="user.password"
            dense
            filled
            placeholder="Password"
            :type="isPwd ? 'password' : 'text'"
            borderless
            class="q-py-sm"
            @input="isPresent"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="q-py-lg">
            <q-btn
              no-caps
              label="Sign Up"
              type="submit"
              class="full-width"
              :disable="disable"
              color="primary"
              unelevated
            />
          </div>

          <q-separator />

          <div v-if="errors.length" class="q-mt-md">
            <p class="text-bold">Please correct the following error(s):</p>
            <q-list class="text-red">
              <q-item v-for="(error, index) in errors" :key="index">
                <span class="q-mr-sm">></span>{{ error }}
              </q-item>
            </q-list>
          </div>

          <div class="text-center text-grey-5">
            By signing up, you agree to our Terms , Data Policy and Cookies
            Policy .
          </div>
        </q-form>
      </div>
    </div>

    <div class="q-mt-md">
      <p>
        Have an account?
        <q-btn flat no-caps dense color="primary" to="/login" label="Log In" />
      </p>
    </div>
  </q-page>
</template>

<script>
import * as fb from 'src/boot/firebase'
export default {
  name: "PageSignup",
  data() {
    return {
      user: {
        fullName: null,
        email: null,
        username: null,
        password: ''
      },
      disable: true,
      isPwd: 'password',
      errors: []
    };
  },
  methods: {
    isPresent() {
      if (this.user.fullName && this.user.email && this.user.password && this.user.username)
        this.disable = false
    },
    validate() {
      this.errors = []
      if (!this.user.fullName || this.user.fullName.split(" ").length !== 2)
        this.errors.push(
          `First and last name required
           Example: 'John Doe'`
        )

      if (!this.user.email) this.errors.push("Email required")
      if (!this.validEmail(this.user.email))
        this.errors.push("Valid email required")

      if (!this.user.username) this.errors.push("Username required")

      if (!this.user.password) this.errors.push("Password required")
      if (!this.validPassword(this.user.password)) {
        const passwordHint = ["one special character required", "one lower case letter required", "one uppercase letter required", "one number required", "min 8 characters required"]
        for (const hint of passwordHint) {
          this.errors.push(hint)
        }
      }

      if (!this.errors.length) {
        this.signUp()
      }
    },
    signUp() {
      fb.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(userCredential => {
        const user = userCredential.user
        // Signed in
        fb.usersCollection.doc(user.uid).set({
          userId: user.uid,
          username: this.user.username,
          firstName: this.user.fullName.split(' ')[0],
          lastName: this.user.fullName.split(' ')[1],
          avatar: 'https://source.unsplash.com/random',
          bio: '',
          followers: {},
          following: {}
        })
        // fetch user profile and set in state
        this.$store.dispatch('pwrup/fetchUserProfile', user)
        this.$q.notify({
          type: 'positive',
          message: `Account created!`
        })
        this.$router.push('/login')
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: error.message
        })
        this.$store.commit('pwrup/setError', error)
      })
    },
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validPassword(password) {
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      return strongRegex.test(password)
    }
  }
};
</script>

<style lang="sass" scoped>
.inputField
  max-width: 350px
  background-color: white
  border: 1px solid $grey-4
  border-radius: 1px
</style>
