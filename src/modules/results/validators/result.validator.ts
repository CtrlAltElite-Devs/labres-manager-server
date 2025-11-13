import { BadRequestException } from "@nestjs/common";

export type ValidatedTestResult = {
    pid: string;
    testName: string;
    size: number;
    testDate: Date
}

// Output type
export type ValidatedTestResultV2 = {
    pid: string;
    dob: string;
    lastName: string;
    testName: string;
    testDate: Date;
    size: number;
}

// Fully typed PartValidator interface
export interface PartValidator<K extends keyof ValidatedTestResultV2> {
    key: K;
    validate(value: string): ValidatedTestResultV2[K];
}

// PID validator
export class PIDValidator implements PartValidator<'pid'> {
    key = 'pid' as const;
    validate(value: string): string {
        if (!/^\d+$/.test(value)) {
            throw new BadRequestException(`Invalid PID "${value}", must be numeric`);
        }
        return value;
    }
}

// DOB validator for YYYYMMDD format
export class DOBValidator implements PartValidator<'dob'> {
    key = 'dob' as const;

    validate(value: string): string {
        // Check if it matches exactly 8 digits
        if (!/^\d{8}$/.test(value)) {
            throw new BadRequestException(`Invalid DOB "${value}", expected format YYYYMMDD`);
        }

        // Optional: you can validate if it's a real date
        const year = parseInt(value.slice(0, 4), 10);
        const month = parseInt(value.slice(4, 6), 10);
        const day = parseInt(value.slice(6, 8), 10);

        const date = new Date(year, month - 1, day); // JS months are 0-based
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            throw new BadRequestException(`Invalid DOB "${value}", not a valid calendar date`);
        }

        return value; // return as string in YYYYMMDD format
    }
}


// Last Name validator
export class LastNameValidator implements PartValidator<'lastName'> {
    key = 'lastName' as const;
    validate(value: string): string {
        if (!value || value.length < 2) {
            throw new BadRequestException(`Invalid last name "${value}"`);
        }
        return value;
    }
}

// Test Name validator
export class TestNameValidator implements PartValidator<'testName'> {
    key = 'testName' as const;
    validate(value: string): string {
        if (!value || value.length < 2) {
            throw new BadRequestException(`Invalid test name "${value}"`);
        }
        return value;
    }
}

// Test Date validator
export class TestDateValidator implements PartValidator<'testDate'> {
    key = 'testDate' as const;
    validate(value: string): Date {
        const str = value.endsWith('.pdf') ? value.slice(0, -4) : value;
        const date = new Date(str);
        if (isNaN(date.getTime())) {
            throw new BadRequestException(`Invalid test date "${value}", expected YYYY-MM-DD`);
        }
        return date;
    }
}
