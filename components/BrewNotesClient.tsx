"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { useState, useEffect } from "react";
import {
  calculateAbv,
  calculateLalTruncated,
  calculateLal,
} from "@/lib/excise/calculate";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function BrewNotesClient() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Array<Record<string, any>>>([]);
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  // Load submissions from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("brew_submissions");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSubmissions(parsed);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Persist submissions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("brew_submissions", JSON.stringify(submissions));
    } catch (e) {
      // ignore quota errors
    }
  }, [submissions]);

  function toggleExpanded(id: string) {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function clearHistory() {
    localStorage.removeItem("brew_submissions");
    setSubmissions([]);
    setExpandedMap({});
  }

  const form = useForm<z.infer<typeof batchDataSchema>>({
    resolver: zodResolver(batchDataSchema),
  });

  // Watch inputs we need to derive values from. useWatch makes these
  // values update live as the user types without introducing local state.
  const [watchedOg, watchedFg, watchedPackagedLitres, watchedExciseRate] =
    useWatch({
      control: form.control,
      name: ["og", "fg", "packagedLitres", "exciseDutyRate"],
    }) as Array<unknown>;

  function safeNumber(v: unknown): number | undefined {
    if (v === undefined || v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }

  const parsedOg = safeNumber(watchedOg);
  const parsedFg = safeNumber(watchedFg);

  // Derived ABV (percent). Calculate only when both OG and FG are valid numbers.
  const derivedAbv =
    parsedOg !== undefined && parsedFg !== undefined
      ? calculateAbv(parsedOg, parsedFg)
      : undefined;

  const abvDisplay = derivedAbv !== undefined ? derivedAbv.toFixed(2) : "";

  // LAL uses the existing helper. It expects ABV as percent (e.g. 5.0).
  const parsedPackaged = safeNumber(watchedPackagedLitres);
  const parsedRate = safeNumber(watchedExciseRate);

  const lal =
    parsedPackaged !== undefined && derivedAbv !== undefined
      ? calculateLalTruncated(parsedPackaged, derivedAbv)
      : undefined;

  // Excise duty: use user-provided rate if present, otherwise default to 57.79
  const exciseDuty =
    lal !== undefined
      ? Math.trunc(lal * (parsedRate ?? 57.79) * 100) / 100
      : undefined;

  function onClickHandler() {
    // Ensure batchDate includes the time of submission: merge selected date
    // (which usually contains only a date) with the current time.
    const selected = form.getValues("batchDate") as Date | undefined;
    const now = new Date();
    const finalBatchDate = selected ? new Date(selected) : new Date();
    finalBatchDate.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    // Update the form's batchDate so debug panel shows the correct datetime.
    form.setValue("batchDate", finalBatchDate as any);

    // Prepare derived values to include in the returned payload.
    const abvForOutput = derivedAbv;
    const preciseLal =
      parsedPackaged !== undefined && abvForOutput !== undefined
        ? parseFloat(calculateLal(parsedPackaged, abvForOutput))
        : undefined;
    const truncatedLalForOutput = lal;
    const dutyForOutput = exciseDuty;

    const output = {
      ...form.getValues(),
      batchDate: finalBatchDate,
      abv: abvForOutput,
      preciseLal: preciseLal,
      truncatedLal: truncatedLalForOutput,
      dutyPayable: dutyForOutput,
      submittedAt: new Date().toISOString(),
    };

    // store submission for rendering a history of cards
    setSubmissions((prev) => [output, ...prev]);

    return toast("Brew data submitted successfully", {
      description: JSON.stringify(output, null, 2),
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
                  {/* ABV is derived from OG/FG and shown as a read-only value. It is not
                      registered with react-hook-form to avoid duplicating derived state. */}
                  <Input id="abv" placeholder="5.0" value={abvDisplay} readOnly />
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
                  <FieldLabel htmlFor="abv">Alcohol By Volume (ABV%)*</FieldLabel>
                  {/* Use the same derived ABV in the excise section; display-only. */}
                  <Input id="abv" placeholder="5.0" value={abvDisplay} readOnly />
                </Field>

                <Field>
                  <FieldLabel>Labelling Alcohol Litres (LAL)</FieldLabel>
                  <Input
                    id="lal"
                    value={lal !== undefined ? String(lal) : ""}
                    readOnly
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="exciseDutyRate">
                    Excise Duty Rate*
                    <a
                      href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/excise-on-alcohol/excise-duty-rates-for-alcohol"
                      target="__blank"
                      className="text-xs underline"
                    >
                      Current excise rates
                    </a>
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
                <Field>
                  <FieldLabel>Excise Duty Payable (AUD)</FieldLabel>
                  <Input
                    id="exciseDuty"
                    value={exciseDuty !== undefined ? exciseDuty.toFixed(2) : ""}
                    readOnly
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>

        <Button onClick={onClickHandler} className="mt-6">
          Submit
        </Button>
      </div>

      {/* Render submitted cards (newest first) */}
      {submissions.length > 0 && (
        <div className="">
          <div className="flex flex-col items-center justify-between gap-6 mb-3">
            <div className="text-sm text-gray-600">{submissions.length} submission(s)</div>
            <div className="flex gap-2 mb-6">
              <Button onClick={() => setExpandedMap(() => ({}))} className="text-sm">
                Collapse All
              </Button>
              <Button onClick={clearHistory} className="text-sm bg-red-50 text-red-700">
                Clear History
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {submissions.map((s, idx) => {
              const id = (s.submittedAt ?? String(idx)) as string;
              const expanded = Boolean(expandedMap[id]);
              return (
                <Card key={id} className="bg-gray-50">
                  <CardHeader>
                    <div className="w-full flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">{s.productName || "Untitled product"}</CardTitle>
                        <div className="text-xs text-gray-500">{s.batchDate ? new Date(s.batchDate).toLocaleString() : "-"}</div>
                      </div>
                      <div>
                        <Button onClick={() => toggleExpanded(id)} className="text-sm">
                          {expanded ? "Collapse" : "Expand"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded && (
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>OG / FG:</strong> {s.og || "-"} / {s.fg || "-"}
                        </p>
                        <p>
                          <strong>ABV%:</strong> {s.abv ?? "-"}
                        </p>
                        <p>
                          <strong>Ingredients:</strong> {s.ingredients || "-"}
                        </p>
                        <p>
                          <strong>Mash Temp (°C):</strong> {s.mashTempC || "-"}
                        </p>
                        <p>
                          <strong>Boil Time (mins):</strong> {s.boiltimeMins || "-"}
                        </p>
                        <p>
                          <strong>Fermentation Temp (°C):</strong> {s.fermentationTempC || "-"}
                        </p>
                        <p>
                          <strong>Yeast:</strong> {s.yeast || "-"}
                        </p>
                        <p>
                          <strong>Notes:</strong> {s.notes || "-"}
                        </p>
                        <p>
                          <strong>Packaged Litres:</strong> {s.packagedLitres || "-"}
                        </p>
                        <p>
                          <strong>Excise Rate:</strong> {s.exciseDutyRate || "-"}
                        </p>
                        <p>
                          <strong>Precise LAL:</strong> {s.preciseLal ?? "-"}
                        </p>
                        <p>
                          <strong>Truncated LAL:</strong> {s.truncatedLal ?? "-"}
                        </p>
                        <p>
                          <strong>Duty Payable (AUD):</strong> {s.dutyPayable ?? "-"}
                        </p>
                        <p className="text-xs text-gray-500">Submitted: {new Date(s.submittedAt).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {
        form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
          <Card className="mb-6 border border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Validation Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-red-700">
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {error?.message as string}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) 
      }
    </section>
  );
}
