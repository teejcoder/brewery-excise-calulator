// v1 types for demo purposes
export type SubmissionFormData = {
  size: string;
  abv: string;
  exciseDutyRate: string;
  productName: string;
  batchDate: Date | undefined;
  preciseLal: string; // e.g. "3.28"
  truncatedLal: number; // e.g. 3.2 (tax rule: truncated to 1 dp)
  dutyPayable: number; // e.g. 184.92 (truncated to 2 dp)
  submittedAt: string;
};

export type BatchDataType = {
  productName: string;
  batchDate: Date;

  og: number;
  fg: number;
  abv: number;

  packagedLitres: number;
  exciseDutyRate: number;

  preciseLal: number; // e.g. "3.28"
  truncatedLal: number; // e.g. 3.2 (tax rule: truncated to 1 dp)
  dutyPayable: number; // e.g. 184.92 (truncated to 2 dp)

  mashTempC?: number;
  boiltimeMins?: number;
  fermentationTempC?: number;
  yeast?: string;
  notes?: string;

  ingredients?: string;

  createdAt: string;
};

