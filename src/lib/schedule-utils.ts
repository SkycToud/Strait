import { ScheduleRule, FacilityData } from './schedules';

function getRuleDateSpecificity(rule: ScheduleRule): number {
    if (rule.type === 'specific_date') return 2;
    if (rule.type === 'range') return 1;
    return 0;
}

function getRuleRecurringSpecificity(rule: ScheduleRule): number {
    if (rule.type === 'wednesday' || rule.type === 'saturday' || rule.type === 'sunday') {
        return 1;
    }
    if (rule.type === 'weekday') {
        return 0;
    }
    return -1;
}

function getRuleSourcePriority(rule: ScheduleRule): number {
    if (rule.source === 'monthly') {
        return 2;
    }
    return 1;
}

function getRuleOpenClosePriority(rule: ScheduleRule): number {
    return rule.isClosed ? 1 : 0;
}

function compareRulesByPrecedence(a: ScheduleRule, b: ScheduleRule): number {
    const sourceDiff = getRuleSourcePriority(b) - getRuleSourcePriority(a);
    if (sourceDiff !== 0) {
        return sourceDiff;
    }

    const dateSpecificityDiff = getRuleDateSpecificity(b) - getRuleDateSpecificity(a);
    if (dateSpecificityDiff !== 0) {
        return dateSpecificityDiff;
    }

    const recurringSpecificityDiff = getRuleRecurringSpecificity(b) - getRuleRecurringSpecificity(a);
    if (recurringSpecificityDiff !== 0) {
        return recurringSpecificityDiff;
    }

    const openCloseDiff = getRuleOpenClosePriority(b) - getRuleOpenClosePriority(a);
    if (openCloseDiff !== 0) {
        return openCloseDiff;
    }

    return 0;
}

function getHighestPriorityRule(date: Date, rules: ScheduleRule[]): ScheduleRule | null {
    const matchedRules = rules.filter((rule) => matchesRule(date, rule));

    if (matchedRules.length === 0) {
        return null;
    }

    matchedRules.sort(compareRulesByPrecedence);
    return matchedRules[0];
}

export function getJSTDateString(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

export function getJSTDay(date: Date): number {
    const dayName = date.toLocaleDateString('en-US', { timeZone: 'Asia/Tokyo', weekday: 'short' });
    const days: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    return days[dayName];
}

export function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
    const jstDateStr = getJSTDateString(date);
    return jstDateStr >= startDate && jstDateStr <= endDate;
}

export function isDateInList(date: Date, dates: string[]): boolean {
    const dateStr = getJSTDateString(date);
    return dates.includes(dateStr);
}

export function isWeekday(date: Date): boolean {
    const day = getJSTDay(date);
    return day >= 1 && day <= 5;
}

export function isWednesday(date: Date): boolean {
    return getJSTDay(date) === 3;
}

export function isSaturday(date: Date): boolean {
    return getJSTDay(date) === 6;
}

export function isSunday(date: Date): boolean {
    return getJSTDay(date) === 0;
}

export function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
    return currentTime >= startTime && currentTime <= endTime;
}

export function getCurrentTime(date: Date = new Date()): string {
    return date.toLocaleTimeString('en-GB', { 
        timeZone: 'Asia/Tokyo', 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

export function isFacilityOpen(date: Date, facility: FacilityData): boolean {
    const currentTime = getCurrentTime(date);

    const topRule = getHighestPriorityRule(date, facility.rules);
    if (!topRule || topRule.isClosed) {
        return false;
    }

    return topRule.hours.some(hour => isTimeInRange(currentTime, hour.start, hour.end));
}

export function matchesRule(date: Date, rule: ScheduleRule): boolean {
    switch (rule.type) {
        case 'specific_date':
            return rule.dates ? isDateInList(date, rule.dates) : false;
            
        case 'range':
            return rule.startDate && rule.endDate 
                ? isDateInRange(date, rule.startDate, rule.endDate)
                : false;
                
        case 'weekday':
            return isWeekday(date);
            
        case 'wednesday':
            return isWednesday(date);
            
        case 'saturday':
            return isSaturday(date);
            
        case 'sunday':
            return isSunday(date);
            
        case 'national_holiday':
            return false;
            
        default:
            return false;
    }
}

export function getFacilityHours(date: Date, facility: FacilityData): { start: string; end: string }[] {
    const topRule = getHighestPriorityRule(date, facility.rules);

    if (!topRule || topRule.isClosed) {
        return [];
    }

    return topRule.hours;
}

export function getFacilityStatus(date: Date, facility: FacilityData): {
    isOpen: boolean;
    hours: { start: string; end: string }[];
    note?: string;
} {
    const currentTime = getCurrentTime(date);

    const topRule = getHighestPriorityRule(date, facility.rules);
    if (!topRule) {
        return {
            isOpen: false,
            hours: [],
            note: '営業時間外'
        };
    }

    if (topRule.isClosed) {
        return {
            isOpen: false,
            hours: [],
            note: topRule.note || '営業時間外'
        };
    }

    const isOpen = topRule.hours.some(hour => isTimeInRange(currentTime, hour.start, hour.end));

    return {
        isOpen,
        hours: topRule.hours,
        note: topRule.note
    };
}
