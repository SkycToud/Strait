export type FacilityId =
    | 'research-lecture'
    | 'library'
    | 'circle-building'
    | 'agora'
    | 'meal-cafeteria'
    | 'hatchpotchi'
    | 'savoru-cafeteria'
    | 'student-affairs'
    | 'admissions-office'
    | 'accounting-office'
    | 'certificate-machine'
    | 'health-care-center';

export type ScheduleRule = {
    type: 'weekday' | 'wednesday' | 'saturday' | 'sunday' | 'specific_date' | 'range' | 'national_holiday';
    dates?: string[]; // ISO YYYY-MM-DD
    startDate?: string;
    endDate?: string;
    hours: { start: string; end: string }[];
    note?: string;
    isClosed?: boolean;
    source?: 'base' | 'monthly';
};

export type FacilityData = {
    name: string;
    nameEn: string;
    category: 'facility' | 'admin';
    rules: ScheduleRule[];
    exceptions?: Record<string, { status: 'closed' | 'open'; reason?: string; hours?: { start: string; end: string }[] }>;
    unpublishedFrom?: string; // YYYY-MM-DD
};

export type MonthlyExceptionEntry = {
    facilityId: FacilityId;
    type: 'specific_date' | 'range';
    status: 'open' | 'closed';
    date?: string;
    startDate?: string;
    endDate?: string;
    hours?: { start: string; end: string }[];
    note?: string;
};

export type MonthlyFacilityExceptionFile = {
    month: string; // YYYY-MM
    exceptions: MonthlyExceptionEntry[];
};

import calendarData from '../data/calendar.json';
import { MONTHLY_FACILITY_EXCEPTION_DATA } from '../data/facility-schedule-exceptions';

// Helper Functions
const times = (start: string, end: string) => [{ start, end }];

const Rules = {
    // Basic Rule Generators
    date: (date: string, hours: { start: string; end: string }[], note?: string): ScheduleRule => ({
        type: 'specific_date', dates: [date], hours, note
    }),
    range: (startDate: string, endDate: string, hours: { start: string; end: string }[], note?: string): ScheduleRule => ({
        type: 'range', startDate, endDate, hours, note
    }),
    weekday: (hours: { start: string; end: string }[], note?: string): ScheduleRule => ({
        type: 'weekday', hours, note
    }),
    subWeekday: (type: 'wednesday' | 'saturday' | 'sunday', hours: { start: string; end: string }[], isClosed = false): ScheduleRule => ({
        type, hours, isClosed
    }),

    // Dynamic Rules
    nationalHoliday: (isClosed = true, note?: string): ScheduleRule => ({
        type: 'national_holiday', hours: [], isClosed, note: note || '祝日'
    }),

    // Shortcuts for Closed/Open
    closedDate: (date: string, note?: string): ScheduleRule => ({
        type: 'specific_date', dates: [date], hours: [], isClosed: true, note
    }),
    closedRange: (startDate: string, endDate: string, note?: string): ScheduleRule => ({
        type: 'range', startDate, endDate, hours: [], isClosed: true, note
    }),
    closedWeekends: (): ScheduleRule[] => [
        { type: 'saturday', hours: [], isClosed: true },
        { type: 'sunday', hours: [], isClosed: true }
    ]
};

// Common Hours
const HO = {
    DEFAULT: times('09:00', '20:00'),
    EARLY_LATE: times('08:00', '20:00'),
    LUNCH_STD: times('11:00', '14:30'),
    LUNCH_SHORT: times('11:00', '13:30'),
    LUNCH_EXAM: times('11:30', '13:30'),
    LUNCH_WED: times('11:00', '13:30'),
    STORE_STD: times('10:00', '16:30'),
    STORE_SHORT: times('10:00', '15:00'),
    STORE_WED: times('10:00', '15:00'),
    ADMIN_STD: times('09:00', '17:00'),
    ADMIN_LUNCH: [
        { start: '09:00', end: '12:40' },
        { start: '13:40', end: '16:30' }
    ],
    ADMISSION_LUNCH: [
        { start: '09:00', end: '12:00' },
        { start: '13:00', end: '17:00' }
    ]
};

// Common Admin Rules (Closed dates shared across all admin facilities)
const COMMON_ADMIN_RULES: ScheduleRule[] = [
    // Exceptions: New Year
    Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),

    // Weekends are closed
    ...Rules.closedWeekends(),
]

// Restricted Entry Rules for Lecture Building
const RESTRICTED_ENTRY_RULES: ScheduleRule[] = calendarData.events
    .filter(event => 
        event.label && (
            event.label.includes('入構制限日') || 
            event.label.includes('大学入学共通テスト') ||
            event.label.includes('第2次学力試験')
        )
    )
    .map(event => {
        if (event.startDate && event.endDate) {
            return Rules.closedRange(event.startDate, event.endDate, event.label);
        } else if (event.date) {
            return Rules.closedDate(event.date, event.label);
        }
        return null;
    })
    .filter((rule): rule is ScheduleRule => rule !== null);

const MONTHLY_EXCEPTION_REGISTRY: Record<string, MonthlyFacilityExceptionFile> =
    MONTHLY_FACILITY_EXCEPTION_DATA.reduce((acc, item) => {
        acc[item.month] = item as MonthlyFacilityExceptionFile;
        return acc;
    }, {} as Record<string, MonthlyFacilityExceptionFile>);

function toMonthKey(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit'
    }).format(date).split('-');

    return `${parts[0]}-${parts[1]}`;
}

function monthlyExceptionToRule(entry: MonthlyExceptionEntry): ScheduleRule {
    const isClosed = entry.status === 'closed';

    if (entry.type === 'specific_date') {
        if (!entry.date) {
            throw new Error(`Monthly exception is missing date for facility ${entry.facilityId}`);
        }

        return {
            type: 'specific_date',
            dates: [entry.date],
            hours: isClosed ? [] : (entry.hours || []),
            isClosed,
            note: entry.note,
            source: 'monthly'
        };
    }

    if (!entry.startDate || !entry.endDate) {
        throw new Error(`Monthly range exception is missing startDate/endDate for facility ${entry.facilityId}`);
    }

    return {
        type: 'range',
        startDate: entry.startDate,
        endDate: entry.endDate,
        hours: isClosed ? [] : (entry.hours || []),
        isClosed,
        note: entry.note,
        source: 'monthly'
    };
}

export function getMonthlyExceptionRules(facilityId: FacilityId, date: Date): ScheduleRule[] {
    const monthKey = toMonthKey(date);
    const monthData = MONTHLY_EXCEPTION_REGISTRY[monthKey];

    if (!monthData) {
        return [];
    }

    return monthData.exceptions
        .filter((entry) => entry.facilityId === facilityId)
        .map(monthlyExceptionToRule);
}

export function getFacilityDataWithMonthlyExceptions(facilityId: FacilityId, date: Date): FacilityData {
    const base = CONST_SCHEDULE_DATA[facilityId];
    const monthlyRules = getMonthlyExceptionRules(facilityId, date);

    return {
        ...base,
        rules: [
            ...monthlyRules,
            ...base.rules,
        ]
    };
}

export const CONST_SCHEDULE_DATA: Record<FacilityId, FacilityData> = {
    'research-lecture': {
        name: '研究講義棟',
        nameEn: 'Research & Lecture Building',
        category: 'facility',
        rules: [
            // University Events with restricted access
            ...RESTRICTED_ENTRY_RULES,
            
            // Regular schedule
            Rules.weekday(times('08:00', '20:00')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'library': {
        name: '附属図書館',
        nameEn: 'TUFS Library',
        category: 'facility',
        rules: [
            // Default Logic
            Rules.weekday(times('09:00', '20:00')),
            Rules.subWeekday('saturday', times('13:00', '20:00')),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'circle-building': {
        name: 'サークル棟',
        nameEn: 'Circle Building',
        category: 'facility',
        rules: [
            Rules.weekday(times('08:00', '20:00')),
            Rules.subWeekday('saturday', times('08:00', '20:00')),
            Rules.subWeekday('sunday', times('08:00', '20:00')),
        ]
    },
    'agora': {
        name: 'アゴラグローバル',
        nameEn: 'Agora Global',
        category: 'facility',
        rules: [
            Rules.weekday(times('08:00', '20:00')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'meal-cafeteria': {
        name: '一階食堂ミール',
        nameEn: 'Cafeteria Meal (1F)',
        category: 'facility',
        rules: [
            // Default schedule
            Rules.subWeekday('wednesday', HO.LUNCH_WED),
            Rules.weekday(HO.LUNCH_STD),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'hatchpotchi': {
        name: '購買書籍部ハッチポッチ',
        nameEn: 'Hatchpotchi Store',
        category: 'facility',
        rules: [
            Rules.weekday(HO.STORE_STD),
            Rules.subWeekday('wednesday', HO.STORE_WED),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'savoru-cafeteria': {
        name: '2階食堂さぼおる',
        nameEn: 'Cafeteria Savoru (2F)',
        category: 'facility',
        rules: [
            // Default schedule
            Rules.weekday(HO.LUNCH_STD),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'student-affairs': {
        name: '教務・学生・留学生課',
        nameEn: 'Student Affairs Office',
        category: 'admin',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(HO.ADMIN_LUNCH),
        ]
    },
    'admissions-office': {
        name: '入試課',
        nameEn: 'Admissions Office',
        category: 'admin',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(HO.ADMISSION_LUNCH),
        ]
    },
    'accounting-office': {
        name: '会計課',
        nameEn: 'Accounting Office',
        category: 'admin',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(HO.ADMIN_STD),
        ]
    },
    'certificate-machine': {
        name: '証明書発行機',
        nameEn: 'Certificate Machine',
        category: 'facility',
        rules: [
            Rules.weekday(times('09:00', '17:00')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    'health-care-center': {
        name: '保健管理センター',
        nameEn: 'Health Care Center',
        category: 'admin',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.nationalHoliday(true),
            Rules.weekday([
                { start: '09:30', end: '12:30' },
                { start: '13:30', end: '16:00' }
            ]),
        ]
    }
};
