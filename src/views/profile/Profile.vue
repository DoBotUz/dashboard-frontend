<template>
  <div id="user-edit-tab-info">
    <vx-card>
      <!-- Avatar Row -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="flex items-start flex-col sm:flex-row">
            <img :src="avatar ? `${$url}/public/users/${avatar}` : '/eye.png'" class="mr-8 rounded h-24 w-24" />
            <!-- <vs-avatar :src="data.avatar" size="80px" class="mr-4" /> -->
            <div>
              <p class="text-lg font-medium mb-2 mt-4 sm:mt-0">{{ first_name  }}</p>
              <input type="file" class="hidden" ref="update_avatar_input" @change="updateAvatar" accept="image/*">

              <!-- Toggle comment of below buttons as one for actual flow & currently shown is only for demo -->
              <vs-button type="border" class="mr-4" @click="$refs.update_avatar_input.click()">Изменить аватар</vs-button>

              <vs-button type="border" color="warning" @click="confirmAvatarDelete" v-if="avatar && !avatar_url">Удалить аватар</vs-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Row -->
      <div class="vx-row">
        <vs-col vs-w="6" class="p-4">
          <vs-input class="w-full" label="Email" v-model="email" v-validate="'required|email|max:255'" name="email"  data-vv-as="Email" />
          <span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>

          <vs-input class="w-full mt-4" label="Имя" v-model="first_name" v-validate="'required|max:255'" name="first_name"  data-vv-as="Имя" />
          <span class="text-danger text-sm"  v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
        </vs-col>
        <vs-col vs-w="6" class="p-4">
          <vs-input class="w-full" name="password" label="Новый Пароль" v-model="password" v-validate="'min:6|max:255'" data-vv-as="Пароль" />
          <span class="text-danger text-sm"  v-show="errors.has('password')">{{ errors.first('password') }}</span>

          <vs-input class="w-full mt-4" label="Фамилия" v-model="last_name" v-validate="'required|max:255'" name="last_name"  data-vv-as="Фамилия" />
          <span class="text-danger text-sm"  v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
        </vs-col>
      </div>

      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="saveChanges" :disabled="!validateForm">Сохранить изменения</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import { mapActions } from 'vuex'

export default {
  name: 'Profile',
  components: {
    vSelect
  },
  props: {},
  data () {
    return {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      avatar: '',

      avatar_url: false,
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    ...mapActions(['deleteAvatar', 'updateProfile']),

    async saveChanges () {
      await this.$validator.validateAll();

      if (this.errors.any()) {
        this.$vs.notify({
          title: "Неверный ввод",
          text: "Проверьте правильность заполненных данных",
          color: "warning",
          position: "top-center",
        });
        return;
      }
      const form = {
        email: this.email,
        first_name: this.first_name,
        last_name: this.last_name,
        password: this.password
      };
      if(!this.password)
        delete form.password;

      const file = this.$refs.update_avatar_input.files[0];
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined && !(form[key] instanceof Object))
          formData.append(key, form[key]);
      });
      if(file)
        formData.append('avatar', file);

      this.updateProfile(formData).then(() => {
        this.avatar_url = false;
        this.$vs.notify({
          title: "Отлично",
          text: "Изменения сохранены",
          color: "success",
          position: "top-center",
        });
      });

    },
    updateAvatar () {
      const input = this.$refs.update_avatar_input;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.avatar = e.target.result;
          this.avatar_url = true;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    confirmAvatarDelete() {
      this.$vs.dialog({
        type:'confirm',
        color: 'warning',
        title: `Удалить аватар`,
        acceptText: 'Удалить',
        cancelText: 'Отмена',
        text: `Вы уверены что хотите удалить свой аватар?`,
        accept: this.acceptDelete
      })
    },

    acceptDelete() {
      this.deleteAvatar().then(() => {
        this.avatar = '';
        this.$vs.notify({
          title: "Отлично",
          text: "Аватар удален",
          color: "success",
          position: "top-center",
        });
      })
    },
  },
  mounted() {
    // console.log(this.$store.state.AppActiveUser);
    if(this.$store.state.AppActiveUser){
      this.email = this.$store.state.AppActiveUser.email;
      this.first_name = this.$store.state.AppActiveUser.first_name;
      this.last_name = this.$store.state.AppActiveUser.last_name;
      this.avatar = this.$store.state.AppActiveUser.avatar;
    }
  }
}
</script>
