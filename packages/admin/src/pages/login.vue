<template>
  <main class="login-page">
    <section class="login-story">
      <div class="login-brand">
        <svg
          class="login-mark"
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
        <div>
          <div class="login-brand-name">
            Freyja
          </div>
          <div class="login-brand-subtitle">
            内容工作室
          </div>
        </div>
      </div>
      <div class="login-intro">
        <div class="login-eyebrow">
          YOUR QUIET WORKSPACE
        </div>
        <h1>写作，值得一个<br>安静的地方。</h1>
        <p>整理思绪，记录日常。<br>你的文章、页面与灵感，都从这里开始。</p>
      </div>
      <div class="login-quote">
        “Less, but better.” <span>— Dieter Rams</span>
      </div>
    </section>

    <section class="login-panel">
      <a
        class="back-home"
        href="/"
      >
        返回博客
        <el-icon><Right /></el-icon>
      </a>
      <div class="login-form-wrap">
        <h2>欢迎回来</h2>
        <p class="login-welcome">
          登录以继续管理你的内容
        </p>
        <div
          v-if="errorMessage"
          class="login-error"
          role="alert"
        >
          <el-icon><Warning /></el-icon>
          <span>{{ errorMessage }}</span>
        </div>
        <form @submit.prevent="postLogin">
          <div class="login-field">
            <label for="username">用户名</label>
            <div class="login-control">
              <el-icon><User /></el-icon>
              <input
                id="username"
                v-model="loginForm.username"
                autocomplete="username"
                :disabled="submitting"
                @input="errorMessage = ''"
              >
            </div>
          </div>
          <div class="login-field">
            <label for="password">密码</label>
            <div
              class="login-control"
              :class="{ 'has-error': errorMessage }"
            >
              <el-icon><Lock /></el-icon>
              <input
                id="password"
                v-model="loginForm.password"
                :type="passwordVisible ? 'text' : 'password'"
                autocomplete="current-password"
                :disabled="submitting"
                @input="errorMessage = ''"
                @keydown.enter.prevent="postLogin"
              >
              <button
                class="password-toggle"
                type="button"
                :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
                @click="passwordVisible = !passwordVisible"
              >
                <el-icon><View /></el-icon>
              </button>
            </div>
          </div>
          <button
            class="login-submit"
            type="submit"
            :disabled="submitting"
          >
            {{ submitting ? '正在登录…' : '登 录' }}
          </button>
          <div class="login-security">
            <el-icon><Lock /></el-icon>
            仅限管理员访问
          </div>
        </form>
      </div>
      <div class="login-footer">
        Freyja Admin <span>·</span> 轻盈而专注
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {Lock, Right, User, View, Warning} from '@element-plus/icons-vue'
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'

defineOptions({name: 'FreyjaAdminLogin'})

const router = useRouter()
const loginForm = reactive({username: '', password: ''})
const submitting = ref(false)
const errorMessage = ref('')
const passwordVisible = ref(false)

async function postLogin(): Promise<void> {
  if (submitting.value) return
  submitting.value = true
  errorMessage.value = ''
  try {
    const resp = await fetch('/api/admin/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(loginForm),
    })
    if (resp.status !== 200) {
      errorMessage.value = '用户名或密码不正确，请重新输入。'
      return
    }
    await router.push({name: 'dashboard'})
  } catch {
    errorMessage.value = '无法连接服务，请稍后重试。'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  background: var(--fj-bg-canvas);
  grid-template-columns: minmax(0, 1.18fr) minmax(440px, .82fr);
}

.login-story {
  position: relative;
  display: flex;
  overflow: hidden;
  padding: 44px 56px;
  color: var(--fj-text-inverse);
  background:
    radial-gradient(circle at 78% 23%, #31574a 0, transparent 34%),
    linear-gradient(145deg, var(--fj-pine-900), var(--fj-pine-950));
  flex-direction: column;
}

.login-story::after {
  position: absolute;
  right: -110px;
  bottom: -180px;
  width: 440px;
  height: 440px;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 50%;
  box-shadow: 0 0 0 70px rgb(255 255 255 / 2%), 0 0 0 140px rgb(255 255 255 / 2%);
  content: '';
}

.login-brand {
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-mark {
  width: 36px;
  height: 36px;
  color: var(--fj-brand-accent);
  stroke: currentColor;
  stroke-width: 1.5;
}

.login-brand-name {
  font: 28px Georgia, serif;
}

.login-brand-subtitle {
  margin-top: 2px;
  color: #c6d2cc;
  font-size: 11px;
  letter-spacing: .18em;
}

.login-intro {
  z-index: 1;
  margin: auto 0;
  padding-bottom: 70px;
}

.login-eyebrow {
  display: flex;
  margin-bottom: 24px;
  align-items: center;
  gap: 12px;
  color: #d3a696;
  font-size: 12px;
  letter-spacing: .16em;
}

.login-eyebrow::before {
  width: 30px;
  height: 1px;
  background: #d3a696;
  content: '';
}

.login-intro h1 {
  margin: 0 0 22px;
  font-family: var(--fj-font-display);
  font-size: 46px;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: .03em;
}

.login-intro p {
  max-width: 400px;
  margin: 0;
  color: #bfcac4;
  line-height: 1.9;
}

.login-quote {
  z-index: 1;
  color: #91a59b;
  font-family: var(--fj-font-display);
  font-size: 13px;
}

.login-quote span {
  color: #d9e0db;
}

.login-panel {
  display: flex;
  padding: 38px 64px;
  flex-direction: column;
}

.back-home {
  display: flex;
  align-self: flex-end;
  align-items: center;
  gap: 7px;
  color: var(--fj-text-secondary);
  font-size: 13px;
  text-decoration: none;
}

.back-home:hover {
  color: var(--fj-clay-600);
}

.login-form-wrap {
  width: 100%;
  max-width: 360px;
  margin: auto;
}

.login-form-wrap h2 {
  margin: 0 0 10px;
  font-family: var(--fj-font-display);
  font-size: 30px;
  font-weight: 600;
  letter-spacing: .04em;
}

.login-welcome {
  margin: 0 0 30px;
  color: var(--fj-text-secondary);
  line-height: 1.6;
}

.login-error {
  display: flex;
  margin-bottom: 22px;
  padding: 12px 14px;
  border: 1px solid #efcccc;
  border-radius: 9px;
  align-items: flex-start;
  gap: 10px;
  color: #9d3434;
  background: var(--fj-danger-bg);
  font-size: 13px;
  line-height: 1.55;
}

.login-error .el-icon {
  margin-top: 2px;
  flex: none;
}

.login-field {
  margin-bottom: 20px;
}

.login-field label {
  display: block;
  margin-bottom: 9px;
  font-size: 13px;
  font-weight: 600;
}

.login-control {
  display: flex;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #ccd3cc;
  border-radius: 8px;
  align-items: center;
  background: #fff;
  transition: border-color var(--fj-duration-base), box-shadow var(--fj-duration-base);
}

.login-control:focus-within {
  border-color: var(--fj-clay-600);
  box-shadow: 0 0 0 3px rgb(185 71 50 / 8%);
}

.login-control.has-error {
  border-color: #c85a5a;
}

.login-control > .el-icon {
  color: #87918b;
  font-size: 18px;
  flex: none;
}

.login-control input {
  min-width: 0;
  height: 100%;
  padding: 0 11px;
  border: 0;
  outline: 0;
  color: var(--fj-text-primary);
  background: transparent;
  font-size: 14px;
  flex: 1;
}

.password-toggle {
  display: grid;
  padding: 5px;
  border: 0;
  place-items: center;
  color: #87918b;
  background: transparent;
  cursor: pointer;
}

.login-submit {
  width: 100%;
  height: 48px;
  margin-top: 6px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: var(--fj-clay-600);
  box-shadow: 0 6px 16px rgb(185 71 50 / 14%);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .08em;
  cursor: pointer;
  transition: background-color var(--fj-duration-base), transform var(--fj-duration-base);
}

.login-submit:hover:not(:disabled) {
  background: var(--fj-clay-700);
  transform: translateY(-1px);
}

.login-submit:disabled {
  cursor: wait;
  opacity: .7;
}

.login-security {
  display: flex;
  margin-top: 18px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--fj-text-tertiary);
  font-size: 12px;
}

.login-footer {
  display: flex;
  justify-content: center;
  gap: 7px;
  color: #939b96;
  font-size: 11px;
}

.login-footer span {
  color: var(--fj-clay-600);
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-story {
    display: none;
  }

  .login-panel {
    min-height: 100vh;
    padding: 28px;
  }
}

@media (max-width: 480px) {
  .login-panel {
    padding: 24px;
  }
}
</style>
