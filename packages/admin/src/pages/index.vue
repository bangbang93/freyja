<template>
  <div class="admin-shell">
    <div
      v-if="mobileOpen"
      class="sidebar-backdrop"
      aria-hidden="true"
      @click="mobileOpen = false"
    />
    <aside
      class="admin-sidebar"
      :class="{ 'is-open': mobileOpen }"
    >
      <router-link
        class="admin-brand"
        :to="{ name: 'dashboard' }"
        aria-label="Freyja 概览"
      >
        <svg
          class="brand-mark"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <path d="M20 2l3.8 12.2L36 18l-12.2 3.8L20 34l-3.8-12.2L4 18l12.2-3.8L20 2Z" />
          <circle
            cx="20"
            cy="18"
            r="3"
            fill="currentColor"
            stroke="none"
          />
        </svg>
        <div class="brand-copy">
          <div class="brand-name">
            Freyja
          </div>
          <div class="brand-subtitle">
            内容工作室
          </div>
        </div>
      </router-link>

      <router-link
        class="sidebar-create"
        :to="{ name: 'article.create' }"
        aria-label="新建文章"
      >
        <el-icon><Plus /></el-icon>
        <span>新建文章</span>
      </router-link>

      <nav class="sidebar-navigation">
        <section
          v-for="group in navigation"
          :key="group.label"
          class="nav-group"
        >
          <div class="nav-group-label">
            {{ group.label }}
          </div>
          <router-link
            v-for="item in group.items"
            :key="item.label"
            :to="item.to"
            class="nav-item"
            :class="{ 'is-active': item.routes.includes(String(route.name)) }"
            :title="item.label"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </section>
      </nav>

      <a
        class="sidebar-home"
        href="/"
        aria-label="打开博客"
      >
        <el-icon><TopRight /></el-icon>
        <span>打开博客</span>
      </a>
    </aside>

    <main class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-context">
          <button
            class="mobile-menu"
            type="button"
            aria-label="打开导航"
            @click="mobileOpen = true"
          >
            <el-icon><MenuIcon /></el-icon>
          </button>
          <span>{{ route.meta.section }}</span>
          <b>/ {{ route.meta.title }}</b>
        </div>
        <div class="admin-account">
          <div class="account-avatar">
            {{ avatarLetter }}
          </div>
          <div class="account-copy">
            <div class="account-name">
              {{ user?.username || '管理员' }}
            </div>
            <div class="account-role">
              管理员
            </div>
          </div>
          <button
            class="logout-button"
            type="button"
            aria-label="退出"
            :disabled="loggingOut"
            @click="logout"
          >
            <el-icon><SwitchButton /></el-icon>
            <span>{{ loggingOut ? '正在退出' : '退出' }}</span>
          </button>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ChatLineSquare,
  CollectionTag,
  Document,
  Menu as MenuIcon,
  Notebook,
  Odometer,
  Picture,
  Plus,
  SwitchButton,
  TopRight,
} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'

defineOptions({name: 'FreyjaAdminIndex'})

interface AdminUser {
  username: string
}

const route = useRoute()
const router = useRouter()
const user = ref<AdminUser>()
const mobileOpen = ref(false)
const loggingOut = ref(false)
const navigation = [
  {
    label: '工作台',
    items: [
      {label: '概览', to: {name: 'dashboard'}, icon: Odometer, routes: ['dashboard']},
    ],
  },
  {
    label: '内容',
    items: [
      {
        label: '文章',
        to: {name: 'article.list'},
        icon: Document,
        routes: ['article.list', 'article.create', 'article.edit'],
      },
      {
        label: '页面',
        to: {name: 'page.list'},
        icon: Notebook,
        routes: ['page.list', 'page.create', 'page.edit'],
      },
    ],
  },
  {
    label: '资源与互动',
    items: [
      {label: '附件', to: {name: 'attachment.list'}, icon: Picture, routes: ['attachment.list']},
      {label: '标签', to: {name: 'tag.list'}, icon: CollectionTag, routes: ['tag.list']},
      {label: '评论', to: {name: 'comment.list'}, icon: ChatLineSquare, routes: ['comment.list']},
    ],
  },
]
const avatarLetter = computed(() => user.value?.username.slice(0, 1).toUpperCase() ?? '·')

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

onMounted(async () => {
  try {
    const resp = await fetch('/api/admin/user/login')
    if (resp.status !== 200) {
      window.location.href = '/admin/login'
      return
    }
    user.value = await resp.json() as AdminUser
  } catch {
    ElMessage.error('无法验证登录状态')
  }
})

async function logout(): Promise<void> {
  loggingOut.value = true
  try {
    const failure = await router.push('/login')
    if (failure) return
  } catch {
    return
  } finally {
    loggingOut.value = false
  }
  try {
    const resp = await fetch('/api/admin/user/logout', {method: 'POST'})
    if (resp.status !== 204) throw new Error('logout failed')
  } catch {
    ElMessage.error('退出失败')
  }
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
}

.admin-sidebar {
  position: fixed;
  z-index: 30;
  inset: 0 auto 0 0;
  display: flex;
  width: var(--fj-sidebar-width);
  padding: 28px 18px 20px;
  color: #dbe4de;
  background: linear-gradient(165deg, var(--fj-pine-900), var(--fj-pine-950));
  flex-direction: column;
}

.admin-brand {
  display: flex;
  padding: 0 10px;
  align-items: center;
  gap: 11px;
  color: inherit;
  text-decoration: none;
}

.brand-mark {
  width: 31px;
  height: 31px;
  color: var(--fj-brand-accent);
  stroke: currentColor;
  stroke-width: 1.5;
  flex: none;
}

.brand-name {
  color: #fff;
  font: 26px/1 Georgia, serif;
}

.brand-subtitle {
  margin-top: 6px;
  color: #93a89e;
  font-size: 10px;
  letter-spacing: .18em;
}

.sidebar-create {
  display: flex;
  height: 40px;
  margin: 28px 4px 24px;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: rgb(255 255 255 / 5%);
  font-size: 13px;
  text-decoration: none;
  transition: background-color var(--fj-duration-fast);
}

.sidebar-create:hover {
  background: rgb(255 255 255 / 10%);
}

.nav-group-label {
  margin: 16px 0 7px;
  padding: 0 12px;
  color: #758f83;
  font-size: 10px;
  letter-spacing: .14em;
}

.nav-item {
  position: relative;
  display: flex;
  height: 40px;
  margin-bottom: 4px;
  padding: 0 12px;
  border-radius: 7px;
  align-items: center;
  gap: 11px;
  color: #b9c8c0;
  font-size: 13px;
  text-decoration: none;
  transition: color var(--fj-duration-fast), background-color var(--fj-duration-fast);
}

.nav-item:hover {
  color: #fff;
  background: rgb(255 255 255 / 5%);
}

.nav-item.is-active {
  color: #fff;
  background: rgb(255 255 255 / 8%);
}

.nav-item.is-active::before {
  position: absolute;
  left: -18px;
  width: 3px;
  height: 20px;
  border-radius: 0 3px 3px 0;
  background: var(--fj-brand-accent);
  content: '';
}

.nav-item.is-active .el-icon {
  color: var(--fj-brand-accent-light);
}

.nav-item .el-icon,
.sidebar-home .el-icon {
  width: 18px;
  font-size: 18px;
  flex: none;
}

.sidebar-home {
  display: flex;
  margin-top: auto;
  padding: 18px 10px 0;
  border-top: 1px solid rgb(255 255 255 / 8%);
  align-items: center;
  gap: 9px;
  color: #9eb1a7;
  font-size: 12px;
  text-decoration: none;
}

.sidebar-home:hover {
  color: #fff;
}

.admin-main {
  min-height: 100vh;
  margin-left: var(--fj-sidebar-width);
}

.admin-topbar {
  display: flex;
  height: var(--fj-topbar-height);
  padding: 0 32px;
  border-bottom: 1px solid var(--fj-border);
  align-items: center;
  justify-content: space-between;
  background: rgb(255 255 255 / 86%);
}

.topbar-context {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--fj-text-tertiary);
  font-size: 12px;
}

.topbar-context b {
  color: #4f5b55;
  font-weight: 500;
}

.admin-account {
  display: flex;
  align-items: center;
  gap: 10px;
}

.account-avatar {
  display: grid;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  place-items: center;
  color: #245141;
  background: var(--fj-pine-100);
  font: 600 13px var(--fj-font-display);
}

.account-name {
  font-size: 13px;
  font-weight: 600;
}

.account-role {
  margin-top: 2px;
  color: var(--fj-text-tertiary);
  font-size: 10px;
}

.logout-button,
.mobile-menu {
  display: flex;
  border: 0;
  align-items: center;
  justify-content: center;
  color: #78837d;
  background: transparent;
  cursor: pointer;
}

.logout-button {
  margin-left: 7px;
  padding: 5px 0 5px 16px;
  border-left: 1px solid var(--fj-border);
  gap: 6px;
  font-size: 12px;
}

.logout-button:hover {
  color: var(--fj-clay-600);
}

.logout-button:disabled {
  cursor: wait;
  opacity: .6;
}

.mobile-menu {
  display: none;
  width: 36px;
  height: 36px;
  margin-right: 5px;
  border-radius: var(--fj-radius-sm);
  font-size: 20px;
}

.admin-content {
  max-width: 1440px;
  padding: 26px 32px 40px;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 1023px) {
  .admin-sidebar {
    width: 76px;
    padding: 25px 12px;
  }

  .admin-main {
    margin-left: 76px;
  }

  .admin-brand {
    padding: 0;
    justify-content: center;
  }

  .brand-copy,
  .sidebar-create span,
  .nav-group-label,
  .nav-item span,
  .sidebar-home span {
    display: none;
  }

  .sidebar-create {
    margin: 28px 0;
  }

  .nav-item {
    padding: 0;
    justify-content: center;
  }

  .nav-item.is-active::before {
    left: -12px;
  }

  .admin-content {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .admin-sidebar {
    visibility: hidden;
    width: 224px;
    padding: 28px 18px 20px;
    transform: translateX(-100%);
    transition: transform var(--fj-duration-slow) var(--fj-ease-standard), visibility 0s var(--fj-duration-slow);
  }

  .admin-sidebar.is-open {
    visibility: visible;
    transform: translateX(0);
    transition: transform var(--fj-duration-slow) var(--fj-ease-standard), visibility 0s;
  }

  .sidebar-backdrop {
    position: fixed;
    z-index: 29;
    inset: 0;
    display: block;
    background: rgb(16 41 35 / 36%);
  }

  .admin-main {
    margin-left: 0;
  }

  .admin-brand {
    padding: 0 10px;
    justify-content: flex-start;
  }

  .brand-copy,
  .sidebar-create span,
  .nav-group-label,
  .nav-item span,
  .sidebar-home span {
    display: block;
  }

  .sidebar-create {
    margin: 28px 4px 24px;
  }

  .nav-item {
    padding: 0 12px;
    justify-content: flex-start;
  }

  .mobile-menu {
    display: flex;
  }

  .admin-topbar {
    padding: 0 16px;
  }

  .admin-content {
    padding: 22px 16px 32px;
  }

  .account-copy,
  .logout-button span {
    display: none;
  }

  .logout-button {
    padding-left: 12px;
  }
}
</style>
