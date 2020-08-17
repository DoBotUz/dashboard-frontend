<!-- =========================================================================================
    File Name: VxBreadcrumb.vue
    Description: Breadcrumb component
    Component Name: VxBreadcrumb
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="vx-breadcrumb" :class="classAtr">
        <ul class="flex flex-wrap items-center">
            <li class="inline-flex items-end" v-if="$router.currentRoute.meta.breadcrumb[0].slug === 'home'">
                <router-link :to="$router.currentRoute.meta.breadcrumb[0].url">
                    <feather-icon icon="HomeIcon" svgClasses="h-5 w-5 mb-1 stroke-current text-primary" />
                </router-link>
                <span class="breadcrumb-separator mx-2"><feather-icon :icon="$router.currentRoute.isRTL ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="w-4 h-4" /></span>
            </li>
            <li v-for="(link, index) in $router.currentRoute.meta.breadcrumb.slice(1,-1)" :key="index" class="inline-flex items-center">
                <span v-if="link.slug === 'organization-name'" class="flex">
                  <router-link v-if="link.url" :to="link.url">
                    {{ organization.title }}
                  </router-link>
                  <span v-else>
                    {{ organization.title }}
                  </span>

                  <span class="breadcrumb-separator mx-2 flex"><feather-icon :icon="$router.currentRoute.isRTL ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="w-4 h-4" /></span>
                </span>
                <span v-else class="flex">
                  <router-link :to="link.url" v-if="link.url">{{ link.title }}</router-link>
                  <span class="text-primary cursor-default" v-else>{{ link.title }}</span>
                  <span class="breadcrumb-separator mx-2 flex"><feather-icon :icon="$router.currentRoute.isRTL ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="w-4 h-4" /></span>
                </span>
            </li>
            <li class="inline-flex">
                <span v-if="$router.currentRoute.meta.breadcrumb.slice(-1)[0].active" class="cursor-default">
                  <span v-if="$router.currentRoute.meta.breadcrumb.slice(-1)[0].slug === 'organization-name'">
                    {{ organization.title }}
                  </span>
                  <span v-else>
                    {{ $router.currentRoute.meta.breadcrumb.slice(-1)[0].title }}
                  </span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default{
  name: 'vx-breadcrumb',
  props: ['classAtr'],
  computed: {
    ...mapState(['organization']),
  },
}
</script>
