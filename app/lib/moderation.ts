// ==========================================
// 拾墨杂谈 - 本地内容安全审核（完全免费版）
// 策略：语义结构拦截 + 变形字检测 + 用户可扩展词库
// ==========================================

export interface CheckResult {
  clean: boolean;
  reason: string;
  level: 'safe' | 'suspect' | 'danger';
  field: string;
}

// ========== 文本清洗工具 ==========
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    // 去干扰符号：- _ · • * ~ 等
    .replace(/[\-_\·\•\*\~\,\.\;\:\!\?\/\|\\\+\=\(\)\[\]\{\}\"\']/g, '')
    // 全角转半角
    .replace(/[\uFF10-\uFF19]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/[\uFF21-\uFF3A]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/[\uFF41-\uFF5A]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
}

// 提取纯汉字序列（用于检测插入符号的变形词）
function extractChinese(text: string): string {
  return text.replace(/[^\u4e00-\u9fa5]/g, '')
}

// ========== 第一层：语义结构检测（无关键词） ==========

// 1. 垃圾广告模式
function detectSpamStructure(text: string): CheckResult | null {
  const t = text.toLowerCase()
  
  // 引流话术 + 联系方式
  if (/(加|联系|扫码|戳|点|扫)[\s\S]{0,3}(微信|qq|薇|v|扣扣|企鹅|邮|群|号|码)/i.test(t)) {
    // 同时出现数字或字母组合（疑似账号）
    if (/\d{5,}|[a-z]{5,}\d{2,}/i.test(t)) {
      return { clean: false, reason: '疑似引流广告', level: 'suspect', field: '' }
    }
  }
  
  // 网址/链接
  if (/(https?:\/\/|www\.|[a-z0-9\-]+\.(com|cn|net|org|xyz|top|club|cc))/i.test(t)) {
    return { clean: false, reason: '包含外部链接', level: 'suspect', field: '' }
  }
  
  // 兼职/刷单/赚钱话术
  if (/(兼职|刷单|日赚|月入|高薪|在家.*赚钱|零门槛|无风险|稳赚|躺赚|暴利)/i.test(t)) {
    return { clean: false, reason: '疑似诈骗信息', level: 'danger', field: '' }
  }
  
  // 代孕/器官/违法交易
  if (/(代孕|捐卵|卖卵|器官.*买卖|肾|肝.*源|血.*源|户口.*买卖|学历.*办理)/i.test(t)) {
    return { clean: false, reason: '涉及违法交易', level: 'danger', field: '' }
  }
  
  return null
}

// 2. 异常内容检测
function detectAnomaly(text: string): CheckResult | null {
  // 异常符号密度（超过30%为异常）
  const specialChars = text.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g) || []
  if (specialChars.length / text.length > 0.3 && text.length > 8) {
    return { clean: false, reason: '内容异常（过多干扰符号）', level: 'suspect', field: '' }
  }
  
  // 重复刷屏
  if (/(.)\1{9,}/.test(text)) {
    return { clean: false, reason: '重复刷屏内容', level: 'suspect', field: '' }
  }
  
  // 纯数字/纯字母长串
  if (/^\d{11,}$/.test(text) || /^[a-z]{20,}$/i.test(text)) {
    return { clean: false, reason: '无意义内容', level: 'suspect', field: '' }
  }
  
  return null
}

// 3. 拼音首字母检测（如 f.l.g 类）
function detectPinyinInitials(text: string): CheckResult | null {
  const normalized = text.toLowerCase().replace(/[^a-z]/g, '')
  // 常见敏感拼音缩写（用户可自行扩展此数组）
  const suspiciousInitials = ['flg', 'zf', 'cp', 'ccp']
  for (const initials of suspiciousInitials) {
    if (normalized.includes(initials)) {
      return { clean: false, reason: '包含敏感缩写', level: 'danger', field: '' }
    }
  }
  return null
}

// ========== 第二层：用户可扩展词库 ==========
// 提示：在下方数组中添加你需要拦截的关键词，支持字符串或正则
// 示例：'关键词', /正则模式/

const USER_KEYWORDS: (string | RegExp)[] = [
  // 请在此处添加你的敏感词，例如：
  // '示例词1',
  // '示例词2',
  // /模式/,
]

function detectUserKeywords(text: string): CheckResult | null {
  const normalized = normalize(text)
  const chineseOnly = extractChinese(text)
  
  for (const keyword of USER_KEYWORDS) {
    if (typeof keyword === 'string') {
      // 同时检测原文和清洗后的文本
      if (normalized.includes(keyword) || chineseOnly.includes(keyword)) {
        return { clean: false, reason: '包含不当信息', level: 'danger', field: '' }
      }
    } else if (keyword instanceof RegExp) {
      if (keyword.test(text) || keyword.test(normalized)) {
        return { clean: false, reason: '包含不当信息', level: 'danger', field: '' }
      }
    }
  }
  return null
}

// ========== 主检测函数 ==========
export function checkContent(text: string): Omit<CheckResult, 'field'> {
  if (!text || text.trim().length === 0) {
    return { clean: true, reason: '', level: 'safe' }
  }

  // 顺序：结构 -> 异常 -> 拼音 -> 用户词库
  const checks = [
    detectSpamStructure(text),
    detectAnomaly(text),
    detectPinyinInitials(text),
    detectUserKeywords(text),
  ]
  
  for (const result of checks) {
    if (result) {
      return { clean: result.clean, reason: result.reason, level: result.level }
    }
  }

  return { clean: true, reason: '', level: 'safe' }
}

export function checkArticle(title: string, summary: string, content: string): CheckResult {
  const fields = [
    { name: '标题', text: title },
    { name: '摘要', text: summary },
    { name: '正文', text: content },
  ]
  
  for (const field of fields) {
    const result = checkContent(field.text)
    if (!result.clean) {
      return { ...result, field: field.name }
    }
  }
  
  return { clean: true, reason: '', level: 'safe', field: '' }
}

// 兼容之前的 AI 审核接口
export async function aiCheckText(text: string): Promise<CheckResult | null> {
  const result = checkContent(text)
  if (!result.clean) {
    return { ...result, field: '内容' }
  }
  return null
}

export async function aiCheckArticle(title: string, summary: string, content: string): Promise<CheckResult | null> {
  const result = checkArticle(title, summary, content)
  if (!result.clean) {
    return result
  }
  return null
}