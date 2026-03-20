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
];

// University Events Rules
const UNIVERSITY_EVENTS_RULES: ScheduleRule[] = [
    Rules.date('2026-01-05', [], '授業再開'),
    Rules.date('2026-01-08', [], '履修登録･修正期間(冬学期)'),
    Rules.date('2026-01-09', [], '履修登録･修正期間(冬学期) / 卒業論文・卒業研究 提出締切'),
    Rules.date('2026-01-13', [], '金曜授業実施日'),
    Rules.date('2026-01-15', [], '秋学期授業終了'),
    Rules.closedDate('2026-01-16', 'note.class_cancellation_restricted'),
    Rules.closedRange('2026-01-17', '2026-01-18', 'note.class_cancellation_restricted'),
    Rules.range('2026-01-19', '2026-01-23', [], '秋学期 定期試験期間'),
    Rules.date('2026-01-26', [], '冬学期 授業開始'),

    // February 2026
    Rules.date('2026-02-02', [], '秋学期成績Web閲覧開始(9:00) / 問い合わせ期間開始'),
    Rules.range('2026-02-03', '2026-02-05', [], '秋学期成績問い合わせ期間'),
    Rules.date('2026-02-06', [], '冬学期 授業終了 / 秋学期成績問い合わせ期限(~16:30)'),
    Rules.date('2026-02-16', [], '冬学期成績Web閲覧開始(9:00) / 問い合わせ期間開始'),
    Rules.range('2026-02-17', '2026-02-19', [], '冬学期成績問い合わせ期間'),
    Rules.date('2026-02-20', [], '冬学期成績問い合わせ期限(~16:30)'),
    Rules.closedDate('2026-02-24', 'note.class_cancellation_restricted'),
    Rules.closedDate('2026-02-25', '第2次学力試験（前期）/ 入構制限'),

    // March 2026
    Rules.closedRange('2026-03-11', '2026-03-12', 'note.class_cancellation_restricted'),
    Rules.date('2026-03-12', [], '第2次学力試験（後期）'),
    Rules.range('2026-03-11', '2026-03-20', [], '卒業者・進級者発表'),
    Rules.date('2026-03-20', [], '卒業式（学位記授与式）'),
    Rules.date('2026-03-31', [], '学年終わり'),

    // April 2026
    Rules.date('2026-04-01', [], '新入生オリエンテーション（履修ガイダンス） / 春学期開始'),
    Rules.date('2026-04-02', [], '入学時定期健康診断'),
    Rules.date('2026-04-03', [], '（在学生）定期健康診断'),
    Rules.date('2026-04-04', [], '入学式'),
    Rules.date('2026-04-05', [], '新入生歓迎行事'),
    Rules.date('2026-04-06', [], '（在学生）定期健康診断'),
    Rules.date('2026-04-07', [], '履修相談コーナー / 履修登録期間（全科目）開始'),
    Rules.range('2026-04-08', '2026-04-14', [], '春学期授業開始 / 履修登録期間（全科目）'),
];

// Restricted Entry Rules for Lecture Building
const RESTRICTED_ENTRY_RULES = UNIVERSITY_EVENTS_RULES.filter((r) => {
    if (!r.note) return false;
    return r.note === 'note.class_cancellation_restricted' || r.note.includes('入構制限');
}).map(r => ({
    ...r,
    isClosed: true,
}));

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
