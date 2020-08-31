<template>
  <div>
    <vs-table ref="table" search :data="employees">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addEmployee"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Добавить сотрудника</span>
          </div>
        </div>
      </div>

      <template slot="thead">
        <vs-th sort-key="title">Логин</vs-th>
        <vs-th sort-key="status">Статус</vs-th>
        <vs-th sort-key="status">Роль</vs-th>
        <vs-th sort-key="status">Дата создания</vs-th>
        <vs-th>Действия</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p>{{ tr.email }}</p>
            </vs-td>

            <vs-td>
              <p>{{ tr.status }}</p>
            </vs-td>

            <vs-td>
              <p>{{ tr.role }}</p>
            </vs-td>

            <vs-td>
              <p>{{ tr.created_at }}</p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="editEmployee(tr)"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="deleteEmployee(tr)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <vs-popup title="Форма сотрудника" :active.sync="addPopup" class="vs-con-loading__container">
      <employee-form
        ref="form"
        :data="employeeObj"
        @on-submit="onEmployeeFormSubmit"
      />
    </vs-popup>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import EmployeeForm from './components/employee-form';

export default {
  components: {
    EmployeeForm,
  },
  data() {
    return {
      addPopup: false,
      editing: false,
      employeeObj: {},
    }
  },
  computed: {
    ...mapGetters('employees', {
      employees: 'employees',
    }),
  },
  methods: {
    ...mapActions('employees', ['fetchEmployees', 'createEmployee', 'updateEmployee']),
    addEmployee() {
      this.editing = false;
      this.employeeObj = {};
      this.addPopup = true;
    },
    editEmployee(tr) {
      this.employeeObj = Object.assign({}, tr);
      this.editing = true;
      this.addPopup = true;
    },
    deleteEmployee() {},
    onEmployeeFormSubmit(object) {
      let request = this.createEmployee;
      if (this.editing) {
        request = this.updateEmployee;
      }
      return request(object).then(() => {
          this.$refs.form.$validator.reset();
          this.addPopup = false;
        });
    }
  },
  mounted() {
    this.fetchEmployees();
  }
}
</script>
<style lang="scss" scoped>

</style>