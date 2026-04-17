import fs from 'fs';
import path from 'path';
import facilityData from '../src/data/facilities.json';

type ExceptionEntry = {
  facilityId: string;
  type: 'specific_date' | 'range';
  status: 'open' | 'closed';
  date?: string;
  startDate?: string;
  endDate?: string;
  hours?: { start: string; end: string }[];
  note?: string;
};

type MonthlyExceptionFile = {
  month: string;
  exceptions: ExceptionEntry[];
};

const EXCEPTION_DIR = path.join(process.cwd(), 'src/data/facility-schedule-exceptions');
const KNOWN_FACILITY_IDS = new Set(facilityData.map((facility) => facility.id));

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidMonth(value: string): boolean {
  return /^\d{4}-\d{2}$/.test(value);
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function validateException(entry: ExceptionEntry, month: string, filePath: string, index: number): string[] {
  const errors: string[] = [];
  const label = `${path.basename(filePath)}: exceptions[${index}]`;

  if (!KNOWN_FACILITY_IDS.has(entry.facilityId)) {
    errors.push(`${label} has unknown facilityId: ${entry.facilityId}`);
  }

  if (entry.type === 'specific_date') {
    if (!entry.date || !isValidDate(entry.date)) {
      errors.push(`${label} must have valid date (YYYY-MM-DD) for specific_date`);
    } else if (!entry.date.startsWith(`${month}-`)) {
      errors.push(`${label} date ${entry.date} is outside month ${month}`);
    }
  }

  if (entry.type === 'range') {
    if (!entry.startDate || !isValidDate(entry.startDate)) {
      errors.push(`${label} must have valid startDate (YYYY-MM-DD) for range`);
    }

    if (!entry.endDate || !isValidDate(entry.endDate)) {
      errors.push(`${label} must have valid endDate (YYYY-MM-DD) for range`);
    }

    if (entry.startDate && entry.endDate && entry.startDate > entry.endDate) {
      errors.push(`${label} has startDate later than endDate`);
    }

    if (entry.startDate && !entry.startDate.startsWith(`${month}-`) && entry.endDate && !entry.endDate.startsWith(`${month}-`)) {
      errors.push(`${label} range appears outside month ${month}`);
    }
  }

  if (entry.status === 'open') {
    if (!entry.hours || entry.hours.length === 0) {
      errors.push(`${label} must include non-empty hours when status is open`);
    } else {
      entry.hours.forEach((hour, hourIndex) => {
        if (!isValidTime(hour.start) || !isValidTime(hour.end)) {
          errors.push(`${label} has invalid time in hours[${hourIndex}]`);
        }
        if (hour.start > hour.end) {
          errors.push(`${label} has start time later than end time in hours[${hourIndex}]`);
        }
      });
    }
  }

  if (entry.status === 'closed' && entry.hours && entry.hours.length > 0) {
    errors.push(`${label} must not include hours when status is closed`);
  }

  return errors;
}

function main() {
  if (!fs.existsSync(EXCEPTION_DIR)) {
    console.error(`Missing directory: ${EXCEPTION_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(EXCEPTION_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(EXCEPTION_DIR, file));

  const allErrors: string[] = [];

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content) as MonthlyExceptionFile;

    if (!isValidMonth(parsed.month)) {
      allErrors.push(`${path.basename(filePath)} has invalid month format: ${parsed.month}`);
      return;
    }

    const expectedFilename = `${parsed.month}.json`;
    if (path.basename(filePath) !== expectedFilename) {
      allErrors.push(`${path.basename(filePath)} filename should match month: ${expectedFilename}`);
    }

    if (!Array.isArray(parsed.exceptions)) {
      allErrors.push(`${path.basename(filePath)} exceptions must be an array`);
      return;
    }

    parsed.exceptions.forEach((entry, index) => {
      allErrors.push(...validateException(entry, parsed.month, filePath, index));
    });
  });

  if (allErrors.length > 0) {
    console.error('Facility schedule exception validation failed:');
    allErrors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`Validated ${files.length} monthly exception files successfully.`);
}

main();
