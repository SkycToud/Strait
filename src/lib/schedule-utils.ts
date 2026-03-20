import { ScheduleRule, FacilityData } from './schedules';

export function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
}

export function isDateInList(date: Date, dates: string[]): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return dates.includes(dateStr);
}

export function isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
}

export function isWednesday(date: Date): boolean {
    return date.getDay() === 3;
}

export function isSaturday(date: Date): boolean {
    return date.getDay() === 6;
}

export function isSunday(date: Date): boolean {
    return date.getDay() === 0;
}

export function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
    return currentTime >= startTime && currentTime <= endTime;
}

export function getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM format
}

export function isFacilityOpen(date: Date, facility: FacilityData): boolean {
    const currentTime = getCurrentTime();
    
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
            // Note: Dynamic holiday detection excluded as requested
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
    const currentTime = getCurrentTime();
    const dateStr = date.toISOString().split('T')[0];
    
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
