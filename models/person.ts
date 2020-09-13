export enum Gender {
  male = "M",
  female = "F",
}
export enum College {
  CC = "CC",
  UC = "UC",
  NA = "NA",
  SC = "SC",
  WS = "WS",
  WYS = "WYS",
  SHHO = "SHHO",
  MC = "MC",
  CW = "CW",
  None = "None",
}
export interface Person {
  id: number;
  sid: number;
  chineseName: string;
  englishName: string;
  gender: Gender;
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  college: College;
  major?: string;
  expectedGrad: Date;
}
