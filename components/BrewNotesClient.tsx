"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { batchDataSchema } from "@/lib/schemas/batch";
import * as z from "zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function BrewNotesClient() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof batchDataSchema>>({
    resolver: zodResolver(batchDataSchema),
  });

  function onClickHandler() {
    return toast("Brew data submitted successfully", {
      description: JSON.stringify(form.getValues(), null, 2),
    });
  }

  return (
    <section className="flex flex-col p-6 bg-gray-10 rounded-md shadow-md w-full">
      <div className="mb-6 gap-2 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl text-center text-balance">
            Brew Notes & Excise Duty Calculator
          </h1>
          <span className="text-xs text-balance">
            This form captures brew notes and calculates excise duty payable for
            beer production in Australia.
          </span>
        </div>

        <form className="mb-6">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Section 1. Batch Info</FieldLegend>
              <FieldDescription>Batch</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="productName">Product Name*</FieldLabel>
                  <Input
                    id="productName"
                    placeholder="Mango Sour"
                    {...form.register("productName")}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="batchDate">Batch Date*</FieldLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-left rounded-md border px-3 py-2"
                      >
                        {form.getValues("batchDate")
                          ? form.getValues("batchDate")?.toLocaleDateString()
                          : "Select batch date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent sideOffset={8} className="">
                      <Calendar
                        id="batchDate"
                        className="text-center"
                        mode="single"
                        selected={form.getValues("batchDate")}
                        onSelect={(d) => {
                          form.setValue("batchDate", d as Date | undefined);
                          setIsCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field>
                  <FieldLabel>OG</FieldLabel>
                  <Input id="og" placeholder="1.050" {...form.register("og")} />
                </Field>

                <Field>
                  <FieldLabel>FG</FieldLabel>
                  <Input id="fg" placeholder="1.010" {...form.register("fg")} />
                </Field>

                <Field>
                  <FieldLabel>ABV*</FieldLabel>
                  <Input id="abv" placeholder="5.0" {...form.register("abv")} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
                  <textarea
                    id="ingredients"
                    placeholder="Your feedback helps us improve..."
                    className="text-sm rounded-md border border-gray-300 p-2 w-full"
                    rows={3}
                    {...form.register("ingredients")}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Section 2. Brew Process</FieldLegend>
              <FieldDescription>
                Enter details about your brewing process
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel>Mash Temp (°C)</FieldLabel>
                  <Input
                    id="mashTempC"
                    placeholder="64"
                    {...form.register("mashTempC")}
                  />
                </Field>

                <Field>
                  <FieldLabel>Boil Time (mins)</FieldLabel>
                  <Input
                    id="boilTimeMins"
                    placeholder="60"
                    {...form.register("boiltimeMins")}
                  />
                </Field>

                <Field>
                  <FieldLabel>Fermentation Temp (°C)</FieldLabel>
                  <Input
                    id="fermentationTempC"
                    placeholder="12"
                    {...form.register("fermentationTempC")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="yeast">Yeast</FieldLabel>
                  <Input
                    id="yeast"
                    placeholder="Ale yeast"
                    {...form.register("yeast")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <textarea
                    id="notes"
                    placeholder="Notes about the brew..."
                    className="text-sm rounded-md border border-gray-300 p-2 w-full"
                    rows={3}
                    {...form.register("notes")}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Step 3. Excise Duty Calculation</FieldLegend>
              <FieldDescription>
                Enter details to calculate excise duty payable
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="packagedLitres">
                    Packaged Litres*
                  </FieldLabel>
                  <Input
                    id="packagedLitres"
                    placeholder="85.2"
                    type="number"
                    step="0.01"
                    {...form.register("packagedLitres")}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="abv">
                    Alcohol By Volume (ABV%)*
                  </FieldLabel>
                  <Input
                    id="abv"
                    placeholder="5.0"
                    type="number"
                    step="0.01"
                    {...form.register("abv")}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="exciseDutyRate">
                    Excise Duty Rate (AUD per litre)*
                  </FieldLabel>
                  <Input
                    id="exciseDutyRate"
                    placeholder="57.79"
                    type="number"
                    step="0.01"
                    {...form.register("exciseDutyRate")}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>

        <Button onClick={onClickHandler} className="mt-6">
          Toast!
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Values (for debugging)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs">
            {JSON.stringify(form.getValues(), null, 2)}
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}
