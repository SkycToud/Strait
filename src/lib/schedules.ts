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
    | 'certificate-machine';

export type ScheduleRule = {
    type: 'weekday' | 'wednesday' | 'saturday' | 'sunday' | 'specific_date' | 'range' | 'national_holiday';
    dates?: string[]; // ISO YYYY-MM-DD
    startDate?: string;
    endDate?: string;
    hours: { start: string; end: string }[];
    note?: string;
    isClosed?: boolean;
};

export type FacilityData = {
    name: string;
    nameEn: string;
    category: 'facility' | 'admin';
    rules: ScheduleRule[];
    exceptions?: Record<string, { status: 'closed' | 'open'; reason?: string; hours?: { start: string; end: string }[] }>;
    unpublishedFrom?: string; // YYYY-MM-DD
};

import calendarData from '../data/calendar.json';

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
            // Exceptions: Jan 2026
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.date('2026-01-16', times('09:00', '17:00')),
            Rules.closedRange('2026-01-17', '2026-01-18', '共通テスト'),

            // Exceptions: Feb 2026
            Rules.date('2026-02-24', times('09:00', '17:00')),
            Rules.closedDate('2026-02-25', '入試'),
            Rules.closedDate('2026-02-27', '指定休館日'),

            // Exceptions: Mar 2026
            Rules.date('2026-03-11', times('09:00', '17:00')),
            Rules.closedDate('2026-03-12'),
            Rules.closedDate('2026-03-20', '祝日'),
            Rules.closedDate('2026-03-25', '月末休館日・臨時休館'),
            Rules.date('2026-03-31', times('09:00', '17:00')),

            // Exceptions: Apr 2026
            Rules.date('2026-04-29', HO.DEFAULT, '昭和の日'),
            Rules.date('2026-04-30', times('09:00', '17:00')),

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
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-06', HO.LUNCH_STD),
            Rules.date('2026-01-07', HO.LUNCH_SHORT, '短縮営業'),
            Rules.range('2026-01-08', '2026-01-09', HO.LUNCH_STD),
            Rules.closedRange('2026-01-10', '2026-01-12', '祝日含む'),
            Rules.date('2026-01-13', HO.LUNCH_STD),
            Rules.date('2026-01-14', HO.LUNCH_SHORT, '短縮営業'),
            Rules.date('2026-01-15', HO.LUNCH_STD),
            Rules.closedRange('2026-01-16', '2026-01-18'),
            Rules.range('2026-01-19', '2026-01-23', HO.LUNCH_EXAM),
            Rules.closedRange('2026-01-24', '2026-01-25'),
            Rules.range('2026-01-26', '2026-01-30', times('11:30', '13:00')),
            Rules.closedDate('2026-01-31'),

            // February 2026
            Rules.closedDate('2026-02-01', '定休日'),
            Rules.range('2026-02-02', '2026-02-06', times('11:30', '13:00')),
            Rules.closedDate('2026-02-07', '定休日'),
            Rules.closedDate('2026-02-08', '定休日'),
            Rules.range('2026-02-09', '2026-02-10', times('11:30', '13:00')),
            Rules.closedDate('2026-02-11', '祝日'),
            Rules.range('2026-02-12', '2026-02-13', times('11:30', '13:00')),
            Rules.closedDate('2026-02-14', '定休日'),
            Rules.closedDate('2026-02-15', '定休日'),
            Rules.range('2026-02-16', '2026-02-20', times('11:30', '13:00')),
            Rules.closedDate('2026-02-21', '定休日'),
            Rules.closedDate('2026-02-22', '定休日'),
            Rules.closedDate('2026-02-23', '天皇誕生日（祝日）'),
            Rules.closedDate('2026-02-24'),
            Rules.closedDate('2026-02-25'),
            Rules.range('2026-02-26', '2026-02-27', times('11:30', '13:00')),
            Rules.closedDate('2026-02-28', '定休日'),

            // Default schedule
            Rules.weekday(HO.LUNCH_STD),
            Rules.subWeekday('wednesday', HO.LUNCH_WED),
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
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-09', HO.LUNCH_STD),
            Rules.closedRange('2026-01-10', '2026-01-12'),
            Rules.range('2026-01-13', '2026-01-15', HO.LUNCH_STD),
            Rules.closedRange('2026-01-16', '2026-01-31', '1月末まで休業'),

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
    }
};
