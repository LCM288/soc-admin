/**
 * @packageDocumentation
 * @module Major
 */

/** A major program */
export interface Major {
  /** Major program code */
  code: string;
  /** Major program's Chinese name */
  chineseName: string;
  /** Major program's English name */
  englishName: string;
  /** The faculties that the major program belongs to */
  faculties: string[];
}
