<template>
  <div>
    <ul>
      <li
        v-for="link in linkStore.links"
        :key="link.name"
        class="no-link link-item"
      >
        <a
          :href="link.href"
          target="_blank"
          rel="nofollow"
        >{{ link.name }} <i class="fa fa-external-link-square" /></a>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useLinkStore} from '../../store/link.ts'

const linkStore = useLinkStore()
await linkStore.getLinks()
</script>

<style lang="scss" scoped>
.link-item {
  line-height: 30px;
  a {
    color: #0088cc;
  }
}
</style>
