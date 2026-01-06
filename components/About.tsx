import { Card } from "./ui/card";

export function About() {
  return (
    <Card className="mt-6 flex flex-col p-6 w-full">
        <h2 className="text-2xl text-center">About</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        <p>
          <b>Litre & Levy</b> is an Australian beer excise duty calculator designed for
          homebrewers and small-scale brewers. It helps you estimate the excise
          duty payable based on your beer production details.
        </p>
        <p className="mt-2">
          Please note that while this tool provides estimates, it is not a
          substitute for professional advice. Always consult with a tax
          professional or the Australian Taxation Office (ATO) for accurate and
          up-to-date information regarding excise duties.
        </p>
        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            How to calculate excise duty - AUSTRALIA
          </h2>
          <p>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/excise-on-alcohol/excise-duty-rates-for-alcohol"
              className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find current excise rates here
            </a>
          </p>

          <section>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-4">
              Beer – formula for excise duty
            </h3>
            <p className="mt-2">
              The excise duty for beer is worked out on the alcoholic content
              above 1.15%:
            </p>
            <p className="mt-2 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              Total volume (litres) of product × (alcohol strength – 1.15%) ×
              current excise duty rate
            </p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-4">
              Example: calculating excise duty for beer
            </h4>
            <p className="mt-2 italic">
              Brewery Co delivers 10 cases of beer, each containing 24×355 ml
              bottles with 5% alcohol by volume into the Australian domestic
              market on 8 March 2023. The beer is classified to sub-item 1.10 in
              the Schedule to the Excise Tariff Act 1921 and has a duty rate of
              $57.79 per litre of alcohol (as at 1 February 2023).
            </p>
            <p className="mt-2">The duty payable is calculated as follows:</p>
            <ol className="mt-2 list-decimal list-inside space-y-1 italic">
              <li>10 cases × 24 bottles × 0.355 litres each = 85.2 litres</li>
              <li>85.2 litres × (5% − 1.15%) = 3.28 LALs</li>
              <li>
                For the purpose of calculating duty payable, the LALs are
                truncated to one decimal place.
              </li>
              <li>3.2 × $57.79 = $184.92</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
              Overview
            </h2>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Section 1: Batch Information
              </h3>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Product name</li>
                <li>Batch date</li>
                <li>OG / FG</li>
                <li>ABV</li>
                <li>Ingredients</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Section 2: Brew Process
              </h3>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Mash Temp</li>
                <li>Boil Time</li>
                <li>Fermentation Temp</li>
                <li>Yeast</li>
                <li>Notes</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Section 3: Excise Calculation
              </h3>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Duty rate</li>
                <li>Packaged litres</li>
                <li>LALs</li>
                <li>Duty payable</li>
              </ul>
            </div>

            <p className="mt-4 italic text-gray-700 dark:text-gray-300">
              This gives the brewer a clear mental model:
            </p>
            <ul className="mt-2 list-none space-y-1 ml-4">
              <li>• "What beer did we make?"</li>
              <li>• "How did we brew it?"</li>
              <li>• "How much tax do we owe?"</li>
            </ul>
          </section>
        </div>
      </div>
    </Card>
  );
}
