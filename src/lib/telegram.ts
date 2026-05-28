import type { Lead } from './storage';

const TG_API = 'https://api.telegram.org/bot';

function escapeMD(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

export async function sendLeadToTelegram(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: 'Telegram is not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID).' };
  }

  const lines = [
    '🔵 *Новая заявка / New lead — KREA*',
    '',
    `*Имя / Name:* ${escapeMD(lead.name)}`,
    `*Компания / Company:* ${escapeMD(lead.company || '—')}`,
    `*Контакт / Contact:* ${escapeMD(lead.contact)}`,
    `*Бюджет / Budget:* ${escapeMD(lead.budget || '—')}`,
    `*Локаль / Locale:* ${escapeMD(lead.locale)}`,
    '',
    '*Бриф / Brief:*',
    escapeMD(lead.message || '—'),
    '',
    `_${escapeMD(new Date(lead.createdAt).toLocaleString())}_`
  ];

  try {
    const res = await fetch(`${TG_API}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true
      })
    });
    const data = await res.json();
    if (!data.ok) return { ok: false, error: data.description || 'Telegram API error' };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}
