export function parseDobString(dob: string): Date {
    const year = parseInt(dob.slice(0, 4), 10);
    const month = parseInt(dob.slice(4, 6), 10);
    const day = parseInt(dob.slice(6, 8), 10);
    return new Date(year, month - 1, day);
}