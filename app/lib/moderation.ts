// 内容安全检测
// 如需更严格，上线后接入云文本审核API（阿里云/腾讯云内容安全）

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
  
  export function checkContent(text: string): {
    clean: boolean;
    reason?: string;
    level: 'safe' | 'suspect' | 'danger';
  } {
    if (!text || text.trim().length === 0) return { clean: true, level: 'safe' };
  
    for (const pattern of DANGER_PATTERNS) {
      if (pattern.test(text)) {
        return { clean: false, reason: '包含不当信息', level: 'danger' };
      }
    }
  
    const spamCount = SPAM_PATTERNS.filter((p) => p.test(text)).length;
    if (spamCount >= 2) {
      return { clean: false, reason: '疑似垃圾广告', level: 'suspect' };
    }
  
    return { clean: true, level: 'safe' };
  }
  
  export function checkArticle(title: string, summary: string, content: string) {
    const fields = [
      { name: '标题', text: title },
      { name: '摘要', text: summary },
      { name: '正文', text: content },
    ];
    for (const field of fields) {
      const result = checkContent(field.text);
      if (!result.clean) return { ...result, field: field.name };
    }
    return { clean: true, level: 'safe' as const };
  }