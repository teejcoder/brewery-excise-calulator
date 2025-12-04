import * as z from "zod"

export const batchDataSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  batchDate: z.date().optional(),
  og: z
    .number()
    .min(1.0, "OG must be at least 1.000")
    .max(1.2, "OG cannot exceed 1.200"),
  fg: z
    .number()
    .min(1.0, "FG must be at least 1.000")
    .max(1.2, "FG cannot exceed 1.200"),
  abv: z
    .number()
    .min(0, "ABV% cannot be negative")
    .max(100, "ABV% cannot exceed 100%"),
  packagedLitres: z.number().min(0.1, "Size must be at least 0.1 litres"),
  ingredients: z.string().optional(),

  mashTempC: z.number().min(0).optional(),
  boiltimeMins: z.number().min(0).optional(),
  fermentationTempC: z.number().min(0).optional(),
  yeast: z.string().optional(),
  notes: z.string().optional(),

  exciseDutyRate: z.number().min(0, "Excise duty rate cannot be negative"),
  dutyPayable: z.number().min(0, "Duty payable cannot be negative"),
  preciseLal: z.number().min(0, "LAL cannot be negative"),
  truncatedLal: z.number().min(0, "LAL cannot be negative"),

  createdAt: z.date().optional(),
});