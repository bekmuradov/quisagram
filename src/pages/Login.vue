<template>
  <q-page class="flex flex-center column">
    <div class="inputField column q-pa-lg">
      <div class="q-mb-md row justify-center">
        <span class="text-cookie text-h3">Quisagram</span>
      </div>
      <div>
        <q-form class="form" @submit.prevent="validate()">
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
            @input="isPresent"
          />
          <q-input
            ref="password"
            v-model="user.password"
            outlined
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
              label="Log In"
              type="submit"
              class="full-width"
              :disable="disable"
              color="primary"
              unelevated
            />
          </div>

          <q-separator />

          <div v-if="validationErrors.length" class="q-mt-md">
            <p class="text-bold">Please correct the following error(s):</p>
            <q-list class="text-red">
              <q-item v-for="(error, index) in validationErrors" :key="index">
                <span class="q-mr-sm">></span>{{ error }}
              </q-item>
            </q-list>
            <q-btn dense flat no-caps label="Reset Errors" @click="resetError" />
          </div>

          <div class="row justify-center">
            <q-btn label="Forgot password?" to="/reset" unelevated no-caps flat dense color="dark" />
          </div>
        </q-form>
      </div>
    </div>

    <div class="q-mt-md">
      <p>
        Don't have an account?
        <q-btn flat no-caps dense color="primary" to="/signup" label="Sing Up" />
      </p>
    </div>
  </q-page>
</template>

<script>
import { auth } from 'src/boot/firebase'
export default {
  name: "PageLogin",
  data () {
    return {
      user: {
        email: '',
        password: null,
      },
      disable: true,
      isPwd: 'password',
      validationErrors: []
    }
  },
  methods: {
    resetError() {
      this.validationErrors = [];
    },
    validate() {
      // Clear the errors before we validate again
      this.resetError();
      // email validation
      if (!this.user.email) {
        this.validationErrors.push("<strong>E-mail</strong> cannot be empty.")
      }
      if (/.+@.+/.test(this.user.email) != true) {
        this.validationErrors.push("<strong>E-mail</strong> must be valid.")
      }
      // password validation
      if (!this.user.password) {
        this.validationErrors.push("<strong>Password</strong> cannot be empty")
      }
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      if (strongRegex.test(this.user.password) != true) {
        this.validationErrors.push(
          "<strong>Password</strong> must be at least 8 characters long, 1 special character, 1 uppercase letter, 1 lower case letter, 1 number"
        )
      }
      // when valid then sign in
      if (this.validationErrors.length <= 0) {
        this.signIn()
      }
    },
    isPresent() {
      if (this.user.email && this.user.password)
        this.disable = false
    },
    signIn() {
      auth.signInWithEmailAndPassword(this.user.email, this.user.password).then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // fetch user profile and set in state
        this.$store.dispatch('pwrup/fetchUserProfile', user)
        this.$q.notify({
          type: 'positive',
          message: `Logged In`
        })
      }).catch((error) => {
        this.$q.notify({
          type: 'negative',
          message: error.message
        })
        this.$store.commit('pwrup/setError', error)
      })
    },
  }
}
</script>

<style lang="sass" scoped>
.inputField
  max-width: 550px
  min-width: 350px
  background-color: white
  border: 1px solid $grey-4
  border-radius: 1px
</style>
