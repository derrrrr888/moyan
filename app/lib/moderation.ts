export interface CheckResult {
  clean: boolean;
  reason: string;
  level: 'safe' | 'suspect' | 'danger';
  field: string;
}

const DANGER_PATTERNS = [
  /(?:法轮|flg|falun)/i,
  /(?:色情|招嫖|约炮|裸聊|福利姬)/i,
  /(?:枪支|毒品|冰毒|海洛因|代孕|器官买卖)/i,
  /(?:博彩|赌球|时时彩|六合彩|网赌)/i,
  /(?:刷单|跑分|洗黑钱|缅北)/i,
];

const SPAM_PATTERNS = [
  /(加微信|加QQ|加薇|加V|联系方式|扫码)[\s\S]{0,10}\d{5,}/i,
];

export function checkContent(text: string): Omit<CheckResult, 'field'> {
  if (!text || text.trim().length === 0) return { clean: true, reason: '', level: 'safe' };

  for (const pattern of DANGER_PATTERNS) {
    if (pattern.test(text)) {
      return { clean: false, reason: '包含不当信息', level: 'danger' };
    }
  }

  const spamCount = SPAM_PATTERNS.filter((p) => p.test(text)).length;
  // 修复：>= 1 即可触发，原来写 >= 2 但规则只有1条
  if (spamCount >= 1) {
    return { clean: false, reason: '疑似垃圾广告', level: 'suspect' };
  }

  return { clean: true, reason: '', level: 'safe' };
}

export function checkArticle(title: string, summary: string, content: string): CheckResult {
  const fields = [
    { name: '标题', text: title },
    { name: '摘要', text: summary },
    { name: '正文', text: content },
  ];
  for (const field of fields) {
    const result = checkContent(field.text);
    if (!result.clean) return { clean: false, reason: result.reason, level: result.level, field: field.name };
  }
  return { clean: true, reason: '', level: 'safe', field: '' };
}