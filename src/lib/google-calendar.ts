/**
 * calendar.json のイベントデータ形式に対応した型定義
 * date/startDate のどちらでも使える
 */
export interface RawCalendarEvent {
  date?: string;
  startDate?: string;
  endDate?: string;
  label?: string;
  title?: string;
  isSemesterSchedule?: boolean;
}

/**
 * YYYY-MM-DD を Googleカレンダー形式の日付文字列 YYYYMMDD に変換
 */
function toGCalDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

/**
 * 翌日の YYYYMMDD を返す（Googleカレンダーの終了日は含まない）
 */
function nextDayStr(dateStr: string): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * calendar.json のイベントに対して Googleカレンダー追加 URL を生成する。
 * - isSemesterSchedule や日付が不定形の場合は null を返す
 */
export function buildGoogleCalendarUrl(event: RawCalendarEvent): string | null {
  if (event.isSemesterSchedule) return null;

  const startStr = event.startDate || event.date;
  if (!startStr) return null;

  // 日付が YYYY-MM-DD 形式かチェック（上旬・中旬などの不定形は除外）
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startStr)) return null;

  const startDate = toGCalDate(startStr);
  const endDate = event.endDate && /^\d{4}-\d{2}-\d{2}$/.test(event.endDate)
    ? nextDayStr(event.endDate)   // 期間イベント: 終了日の翌日
    : nextDayStr(startStr);        // 単日イベント: 開始日の翌日

  const eventName = event.label ?? event.title ?? '';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventName,
    dates: `${startDate}/${endDate}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
