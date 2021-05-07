<template>
  <q-page class="constrain q-pa-md">
    <div class="row">
      <div class="col">
        <div class="camera-frame q-pa-md">
          <video
            v-show="!isImageCaptured"
            ref="video"
            class="full-width"
            autoplay
            playsinline
          />
          <canvas
            v-show="isImageCaptured"
            ref="canvas"
            class="full-width"
            height="180"
          />
        </div>
      </div>
      <div class="col q-pa-lg">
        <div class="text-center q-pa-md">
          <q-btn
            v-if="isCameraSupports"
            round
            color="dark"
            :icon="isImageCaptured ? 'eva-repeat-outline' : 'eva-camera'"
            size="md"
            @click="isImageCaptured ? reCaptureImage() : captureImage()"
          >
            <q-tooltip
            v-if="isImageCaptured"
            content-class="bg-accent"
              >Click to recapture the image</q-tooltip
            >
            <q-tooltip
            v-else
            content-class="bg-accent"
              >Click to capture the image</q-tooltip
            >
          </q-btn>
          <q-file
            v-else
            v-model="imageFromUpload"
            accept="image/*"
            outlined
            label="Pick an image"
            @input="saveImageFromUpload"
          >
            <template v-slot:prepend>
              <q-icon name="eva-attach-outline" />
            </template>
          </q-file>

        </div>
        <div class="row justify-center">
          <q-input
            v-model="captionText"
            dense
            class="col col-sm-8"
            label="Caption *"
            :rules="[ val => val.length <= 70 || 'Please use maximum 70 characters']"
          />
        </div>
        <div class="row justify-center">
          <q-input
            v-model="descriptionText"
            dense
            class="col col-sm-8"
            label="Description (optional)"
          />
        </div>
        <div class="row justify-center">
          <q-input
            v-model="location"
            :loading="locationLoading"
            dense
            class="col col-sm-8"
            label="Location (optional)"
          >
            <template v-slot:append>
              <q-btn
                v-if="!locationLoading && isLocationSupported"
                round
                flat
                dense
                icon="eva-navigation-2-outline"
                @click="getLocation"
              />
            </template>
          </q-input>
        </div>
        <div class="row justify-center q-mt-md">
          <q-btn
            color="primary"
            class="col col-sm-8"
            label="Post Image"
            rounded
            unelevated
            @click="postImage()"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import * as fb from 'src/boot/firebase'
import { uid } from "quasar"
require("md-gum-polyfill")

export default {
  name: "PageUpload",
  data() {
    return {
      expanded: false,
      captionText: "",
      descriptionText: "",
      location: "",
      photo: null,
      isImageCaptured: false,
      isCameraSupports: true,
      imageFromUpload: [],
      locationLoading: false
    };
  },
  computed: {
    isLocationSupported() {
      if ('geolocation' in navigator) return true
      return false
    }
  },
  mounted() {
    this.initCamera()
  },
  beforeDestroy () {
    if (this.isCameraSupports) this.disableCameraOnPageLeave()
  },
  methods: {
    postImage() {
      const metadata = {
        contentType: this.photo.type
      }
      const img = {
          name: uid(),
          src: this.photo
      }
      const post = {
        id: uid(),
        caption: this.captionText,
        description: this.descriptionText,
        location: this.location,
        userId: this.$store.state.pwrup.userProfile.userId,
        publishedAt: Date.now() / 1000, // to get date in milliseconds
        tags: {}, // to be able to search by hashtags
        firstComment: {},
        lastComment: {},
        comments: [],
        reactions: {
          likes: {},
          likesCount: 0
        }
      }

      this.uploadImageToStorage({ image: img, meta: metadata, post: post })
    },
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          this.$refs.video.srcObject = stream
        })
        .catch(() => {
          this.isCameraSupports = false
        });
    },
    captureImage() {
      let video = this.$refs.video
      let canvas = this.$refs.canvas
      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height
      let context = canvas.getContext("2d")
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.isImageCaptured = true
      this.photo = this.dataURItoBlob(canvas.toDataURL())
      this.disableCameraOnPageLeave()
    },
    reCaptureImage() {
      this.photo = ''
      this.isImageCaptured = false
      this.initCamera()
      // let video = this.$refs.video
      // let canvas = this.$refs.canvas
      // canvas.width = video.getBoundingClientRect().width
      // canvas.height = video.getBoundingClientRect().height
      // let context = canvas.getContext("2d")
      // context.drawImage(video, 0, 0, canvas.width, canvas.height)
      // this.isImageCaptured = true
      // this.photo = this.dataURItoBlob(canvas.toDataURL())
      // this.disableCameraOnPageLeave()
    },
    resetInputs() {
      this.captionText = "",
      this.descriptionText = "",
      this.location = "",
      this.photo = null,
      this.isImageCaptured = false,
      this.isCameraSupports = true,
      this.imageFromUpload = [],
      this.locationLoading = false
      this.reCaptureImage()
    },
    saveImageFromUpload(file) {
      this.photo = file
      let canvas = this.$refs.canvas
      let context = canvas.getContext("2d")
      var reader = new FileReader()
      reader.onload = event => {
        var img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img, 0, 0)
          this.isImageCaptured = true
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    },
    uploadImageToStorage ({ image, meta, post }) {
      // get the file type
      const imageType = meta.contentType.substring(6)
      // create the reference to the file
      const imageBlobRef = fb.storage.ref().child('quisagram-images/' + image.name + '.' + imageType)
      const uploadTask = imageBlobRef.put(image.src, meta)
      // set the file name in the post object
      post.imgName = 'quisagram-images/' + image.name + '.' + imageType
      // show notification to the user
      const notif = this.$q.notify({
        group: false, // required to be updatable
        timeout: 0, // we want to be in control when it gets dismissed
        spinner: true,
        message: 'Uploading file...',
        caption: '0%'
      })
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // we update the dialog
          notif({
            caption: `${progress}%`
          })
          switch (snapshot.state) {
            case 'paused':
              notif({
                message: 'Upload is paused'
              })
              break
            case 'running':
              notif({
                message: 'Upload is running'
              })
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              notif({
                icon: 'error',
                spinner: false,
                message: `You don't have permission to access the object`
              })
              break
            case 'storage/canceled':
              // User canceled the upload
              notif({
                icon: 'error',
                spinner: false,
                message: 'You canceled the upload'
              })
              break
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              notif({
                icon: 'error',
                spinner: false,
                message: 'Unknown error occurred, please report us getcyberpresence@gmail.com'
              })
              break
          }
        },
      () => {
        // Upload completed successfully now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          notif({
            icon: 'done', // we add an icon
            spinner: false, // we reset the spinner setting so the icon can be displayed
            message: 'Uploading done!',
            timeout: 2500 // we will timeout it in 2.5s
          })
          post.imgUrl = downloadURL
          this.$store.dispatch('pwrup/addPost', { post: post })
          this.resetInputs()
        })
      })
    },
    getLocation() {
      this.locationLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        this.getCityAndCountry(position)
      }, err => {
        this.locationError(err)
      }, {
        timeout: 7000
      })
    },
    getCityAndCountry(position) {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      const apiUrl = `https://geocode.xyz/${lat},${lon}?json=1`
      this.$axios.get(apiUrl).then(result => {
        this.locationSuccess(result.data)
      }).catch(err => {
        this.locationError(err)
      })
    },
    locationSuccess(data) {
      this.location = data.city
      if (data.country) this.location += `, ${data.country}`
      this.locationLoading = false
    },
    locationError(error) {
      this.$q.dialog({
        title: 'Error',
        message: error.message
      })
      this.locationLoading = false
    },
    disableCameraOnPageLeave() {
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    }
  }
};
</script>

<style lang="sass" scoped>
.camera-frame
  border: 2px solid $dark
  border-radius: 10px

div.row
  @media (max-width: $breakpoint-md-min)
    flex-direction: column
  @media (min-width: $breakpoint-md-min)
    align-items: center
</style>
