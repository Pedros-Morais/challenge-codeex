// This is a simplified declaration file for Day.js
declare module 'dayjs' {
  import dayjs from 'dayjs';
  export default dayjs;
  
  export interface Dayjs {
    format(template?: string): string;
    add(value: number, unit?: dayjs.ManipulateType): Dayjs;
    subtract(value: number, unit?: dayjs.ManipulateType): Dayjs;
    startOf(unit: dayjs.ManipulateType): Dayjs;
    endOf(unit: dayjs.ManipulateType): Dayjs;
    isSame(date: Dayjs | string | number, unit?: dayjs.ManipulateType): boolean;
    isBefore(date: Dayjs | string | number, unit?: dayjs.ManipulateType): boolean;
    isAfter(date: Dayjs | string | number, unit?: dayjs.ManipulateType): boolean;
  }
}
