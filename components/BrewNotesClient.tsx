import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.string().min(1, "Ingredient amount is required"),
  type: z.enum(["grain", "hop", "yeast", "adjunct", "other"]).optional(),
});

const batchDataSchema = z.object({
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
  exciseDutyRate: z.number().min(0, "Excise duty rate cannot be negative"),

  preciseLal: z.number().min(0, "LAL cannot be negative"),
  truncatedLal: z.number().min(0, "LAL cannot be negative"),
  dutyPayable: z.number().min(0, "Duty payable cannot be negative"),

  mashTempC: z.number().min(0).optional(),
  boiltimeMins: z.number().min(0).optional(),
  fermentationTempC: z.number().min(0).optional(),
  yeast: z.string().optional(),
  notes: z.string().optional(),

  ingredients: z.array(ingredientSchema).optional(),
});

export default function BrewNotesClient() {
    const form = useForm<z.infer<typeof batchDataSchema>>({
    resolver: zodResolver(batchDataSchema),
    defaultValues: {
      productName: "",
      batchDate: undefined,
      og: 1.050,
      fg: 1.010,
      abv: 5.0,
      packagedLitres: 85.2,
      exciseDutyRate: 60.0,
      preciseLal: 0,
      truncatedLal: 0,
      dutyPayable: 0,
      mashTempC: 0,
      boiltimeMins: 0,
      fermentationTempC: 0,
      yeast: "",
      notes: "",
      ingredients: [],
    },
  });


  return (
    <section className="flex flex-col p-6 bg-gray-10 rounded-md shadow-md w-full">
      <div className="mb-6">
        <h1 className="text-2xl text-center">
          Brew Notes & Excise Duty Calculator
        </h1>
        <span className="text-xs">
          Total volume (litres) × (ABV% – 1.15%) × current excise duty rate.
        </span>
      </div>
    </section>
  );
}
