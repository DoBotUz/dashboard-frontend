<template>
  <div>
    <vs-input
      class="w-full mb-4"
      label="Имя сотрудника"
      v-model="formData.first_name"
      v-validate="'required'"
      name="first_name"
      data-vv-as="Имя сотрудника"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('first_name')"
    >{{ errors.first('first_name') }}</span>

    <vs-input
      class="w-full mb-4"
      label="Фамилия сотрудника"
      v-model="formData.last_name"
      v-validate="'required'"
      name="last_name"
      data-vv-as="Фамилия сотрудника"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('last_name')"
    >{{ errors.first('last_name') }}</span>

    <vs-row class="mb-4">
      <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
        <vs-input
          label="Логин"
          class="w-full"
          v-model="formData.email"
          v-validate="'required'"
          name="email"
          data-vv-as="Логин"
        />
      </vs-col>
      <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
        <vs-input
          label=" "
          class="w-full"
          :value="`@${$store.state.organization.slug}`"
          disabled
        />
      </vs-col>
    </vs-row>
    <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>

    <vs-input
      class="w-full mb-4"
      label="Пароль"
      v-model="formData.password"
      v-validate="'required'"
      name="password"
      data-vv-as="Пароль"
    />
    <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>

    <vs-select autocomplete class="mb-4" label="Роль" v-model="formData.role">
      <vs-select-item
        :key="index"
        :value="role.key"
        :text="role.value"
        v-for="(role, index) in roles"
      />
    </vs-select>

    <div class="p-0">
      <vs-upload
        :limit="1"
        :show-upload-button="false"
        text="Аватар"
        ref="avatar"
        accept="image/*"
        class="m-0 p-0"
      />
    </div>

    <vs-button
      class="mt-5 mb-3 float-right"
      @click="submitForm"
      color="primary"
      :disabled="!validateForm"
    >{{ 'Сохранить' }}</vs-button>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    let formData = {
      id: this.data.id,
      first_name: this.data.first_name || "",
      last_name: this.data.last_name || "",
      email: this.data.email || "",
      password: this.data.password || "",
      role: this.data.role || 'operator'
    };
    return {
      formData,
      roles: [
        { key: 'operator', value: 'Оператор' },
        { key: 'manager', value: 'Менеджер' },
        { key: 'owner', value: 'Владелец' }
      ]
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any();
    },
  },
  methods: {
    async submitForm() {
      await this.$validator.validateAll();
      if (this.errors.any()) {
        return;
      }
      let file = this.$refs.avatar.filesx[this.$refs.avatar.filesx.length - 1];
      const formData = new FormData();
      let payload = {
        ...this.formData,
        email: `${this.formData.email}@${this.$store.state.organization.slug}`,
        organizationId: this.$store.state.organization.id,
        status: 10
      }
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });
      if (file) {
        formData.append('avatar', file);
      }
      this.$emit('on-submit', formData);
    },
  }
};
</script>
<style lang="scss" scoped>
.con-upload /deep/ .con-img-upload {
  padding: 0;
}
.con-upload /deep/ .con-input-upload {
  margin: 0;
}
</style>