import {existsSync} from 'fs'
import {join} from 'path'
import {defaults} from './defaults'

// dist/config/index.js 起向上四级是仓库根目录
const CONFIG_DIR = join(__dirname, '..', '..', '..', '..', 'config')
// 与 require 的解析顺序一致，同名时 .js 优先于 .json
const SECTION_EXTENSIONS = ['.js', '.json']

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value) as unknown
  return proto === Object.prototype || proto === null
}

// 深合并：override 只覆盖它提供的键，数组等非普通对象的值整体替换
function merge(base: unknown, override: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(override)) return override
  const result: Record<string, unknown> = {...base}
  for (const [key, value] of Object.entries(override)) {
    result[key] = merge(result[key], value)
  }
  return result
}

function findSectionFile(dir: string, section: string): string | undefined {
  return SECTION_EXTENSIONS
    .map((ext) => join(dir, `${section}${ext}`))
    .find((file) => existsSync(file))
}

// 解析失败时在原始错误信息里带上文件路径后原样抛出
function readSectionFile(file: string): unknown {
  try {
    return require(file)
  } catch (err) {
    if (err instanceof Error) err.message = `配置文件加载失败：${file}\n${err.message}`
    throw err
  }
}

// 读取一个环境目录下的段文件，没有对应文件的段不出现在结果里
function loadEnvDir(dir: string): Record<string, unknown> {
  const overrides: Record<string, unknown> = {}
  for (const section of Object.keys(defaults)) {
    const file = findSectionFile(dir, section)
    if (file) overrides[section] = readSectionFile(file)
  }
  return overrides
}

export function loadConfig(): typeof defaults {
  const envName = process.env.CONFIG_ENV ?? process.env.NODE_ENV ?? 'development'
  return merge(defaults, loadEnvDir(join(CONFIG_DIR, envName))) as typeof defaults
}
