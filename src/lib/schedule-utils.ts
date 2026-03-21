import { ScheduleRule, FacilityData } from './schedules';

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
    
    // Check rules in order of precedence
    for (const rule of facility.rules) {
        if (rule.isClosed && matchesRule(date, rule)) {
            return false;
        }
    }
    
    // Find matching rule for current time
    for (const rule of facility.rules) {
        if (matchesRule(date, rule) && !rule.isClosed) {
            return rule.hours.some(hour => isTimeInRange(currentTime, hour.start, hour.end));
        }
    }
    
    return false;
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
    // Find matching rule
    for (const rule of facility.rules) {
        if (matchesRule(date, rule) && !rule.isClosed) {
            return rule.hours;
        }
    }
    
    return [];
}

export function getFacilityStatus(date: Date, facility: FacilityData): {
    isOpen: boolean;
    hours: { start: string; end: string }[];
    note?: string;
} {
    const currentTime = getCurrentTime(date);
    
    // Rule priority: specific_date > range > weekday types
    // Check for closed rules first (in priority order)
    for (const rule of facility.rules) {
        if (rule.isClosed && matchesRule(date, rule)) {
            return {
                isOpen: false,
                hours: [],
                note: rule.note || '営業時間外'
            };
        }
    }
    
    // Find matching open rule (in priority order)
    for (const rule of facility.rules) {
        if (!rule.isClosed && matchesRule(date, rule)) {
            const isOpen = rule.hours.some(hour => isTimeInRange(currentTime, hour.start, hour.end));
            return {
                isOpen,
                hours: rule.hours,
                note: rule.note
            };
        }
    }
    
    return {
        isOpen: false,
        hours: [],
        note: '営業時間外'
    };
}
