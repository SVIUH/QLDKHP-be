export class CreateAiDto {
  subject_id: number;
  year: number;
  term: 1 | 2 | 3;
  existing_classes: {
    class_name: string;
    classDetails: string[]; // e.g. ["LT - ...", "TH - ..."]
  }[];
}
