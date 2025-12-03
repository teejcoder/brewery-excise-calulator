"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import type { SubmissionFormData } from "@/types/batch";

export default function ExciseCalculator() {
  const [size, setSize] = useState<string>("");
  const [abv, setAbv] = useState<string>("");
  const [exciseDutyRate, setExciseDutyRate] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [batchDate, setBatchDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionFormData[]>([]);

  // touched state to only show validation styles after user interacts
  const [touchedSize, setTouchedSize] = useState(false);
  const [touchedAbv, setTouchedAbv] = useState(false);
  const [touchedRate, setTouchedRate] = useState(false);

  // When popover opens, focus selected day (if any) so keyboard navigation works.
  useEffect(() => {
    if (!isCalendarOpen) return;
    const t = setTimeout(() => {
      const el = document.querySelector(
        '[data-selected-single="true"]'
      ) as HTMLElement | null;
      if (el) el.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [isCalendarOpen]);

  function truncateHelper(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  }

  function calculateLal(): string {
    const s = parseFloat(size);
    const a = parseFloat(abv);
    if (Number.isNaN(s) || Number.isNaN(a)) {
      return "0.00";
    }
    const lal = s * ((a - 1.15) / 100); // ABV entered as percent (e.g. 5), subtract 1.15% and convert to fraction (/100)
    // console.log('lal', lal);
    return lal.toFixed(2); // readable precise value for display
  }

  function calculateLalTruncated(): number {
    const preciseLal = parseFloat(calculateLal());
    // console.log('precise lal', preciseLal);
    return truncateHelper(preciseLal, 1);
  }

  function calculateExciseDuty(): number {
    const lal = calculateLalTruncated();
    // console.log("final LAL:", lal);
    const rate = parseFloat(exciseDutyRate);

    if (Number.isNaN(lal) || Number.isNaN(rate)) {
      return 0;
    }
    const exciseDuty = lal * rate;
    // console.log("excise duty:", exciseDuty);
    return Math.trunc(exciseDuty * 100) / 100; // truncated to 2 decimal places
  }

  function handleSubmit() {
    // mark all touched so validation shows if fields missing
    setTouchedSize(true);
    setTouchedAbv(true);
    setTouchedRate(true);

    const isSizeValid = size.trim() !== "" && !Number.isNaN(parseFloat(size));
    const isAbvValid = abv.trim() !== "" && !Number.isNaN(parseFloat(abv));
    const isRateValid = exciseDutyRate.trim() !== "" && !Number.isNaN(parseFloat(exciseDutyRate));

    if (!isSizeValid || !isAbvValid || !isRateValid) {
      return;
    }

    const preciseLal = calculateLal(); // "3.28"
    const truncatedLal = calculateLalTruncated(); // 3.2
    const dutyPayable = calculateExciseDuty(); // truncated to 2 dp as in your implementation

    const payload: SubmissionFormData = {
      productName,
      batchDate,
      size,
      abv,
      exciseDutyRate,
      preciseLal,
      truncatedLal,
      dutyPayable,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [payload, ...prev]);
  }

  return (
    <section className="flex flex-col p-6 bg-gray-10 rounded-md shadow-md w-full">
      <div className="mb-6">
        <h1 className="text-2xl text-center">Excise Duty Calculator</h1>
        <span className="text-xs">
          Total volume (litres) × (ABV% – 1.15%) × current excise duty rate.
        </span>
      </div>
      <form className="flex flex-col gap-4">
        <Label htmlFor="size">Total Volume (litres)*</Label>
        <Input
          id="size"
          placeholder="85.2"
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          onBlur={() => setTouchedSize(true)}
          aria-invalid={touchedSize && (size.trim() === "" || Number.isNaN(parseFloat(size)))}
        />

        <Label htmlFor="abv">
          ABV%: <span className="text-xs">(abv% - 1.15%)*</span>
        </Label>
        <Input
          id="abv"
          placeholder="5.0"
          type="number"
          value={abv}
          onChange={(e) => setAbv(e.target.value)}
          onBlur={() => setTouchedAbv(true)}
          aria-invalid={touchedAbv && (abv.trim() === "" || Number.isNaN(parseFloat(abv)))}
        />

        <Label htmlFor="exciseDutyRate">
          Excise Duty Rate*:{" "}
          <a
            href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/excise-on-alcohol/excise-duty-rates-for-alcohol"
            target="__blank"
            className="text-xs underline"
          >
            Current excise rates
          </a>
        </Label>
        <Input
          id="exciseDutyRate"
          placeholder="57.79"
          type="number"
          value={exciseDutyRate}
          onChange={(e) => setExciseDutyRate(e.target.value)}
          onBlur={() => setTouchedRate(true)}
          aria-invalid={touchedRate && (exciseDutyRate.trim() === "" || Number.isNaN(parseFloat(exciseDutyRate)))}
        />

        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          placeholder="Stout Beer"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <Label htmlFor="batchDate">Batch Date*</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-left rounded-md border px-3 py-2"
              onClick={() => setIsCalendarOpen(true)}
            >
              {batchDate ? batchDate.toLocaleDateString() : "Select batch date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent sideOffset={8} className="w-[320px] p-2">
            <Calendar
              id="batchDate"
              mode="single"
              selected={batchDate}
              onSelect={(d) => {
                setBatchDate(d as Date | undefined);
                setIsCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          className=""
          onClick={handleSubmit}
          disabled={
            size.trim() === "" ||
            abv.trim() === "" ||
            exciseDutyRate.trim() === "" ||
            Number.isNaN(parseFloat(size)) ||
            Number.isNaN(parseFloat(abv)) ||
            Number.isNaN(parseFloat(exciseDutyRate))
          }
        >
          Calculate Excise {"->"}
        </Button>
      </form>
      {submissions.length === 0 ? (
        <Card className="mt-6 p-4 bg-gray-50">
          <h2 className="text-lg text-center mb-2">Calculation Results</h2>
          <p className="text-sm text-center">No submissions yet — click Calculate to capture results.</p>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((s) => (
            <Card key={s.submittedAt} className="p-4 bg-gray-50">
              <h3 className="text-md font-medium">{s.productName || "Untitled product"}</h3>
              <p className="text-xs text-gray-500">Submitted: {new Date(s.submittedAt).toLocaleString()}</p>
              <div className="mt-2">
                <p>Batch Date: {s.batchDate ? s.batchDate.toLocaleDateString() : "N/A"}</p>
                <p>Total Volume (litres): {s.size}</p>
                <p>ABV%: {s.abv}</p>
                <p>Excise Duty Rate: {s.exciseDutyRate}</p>
                <p>Precise LAL: {s.preciseLal}</p>
                <p>Truncated LAL (for duty): {s.truncatedLal.toFixed(1)}</p>
                <p className="text-lime/20">Excise Duty Payable: ${s.dutyPayable.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
