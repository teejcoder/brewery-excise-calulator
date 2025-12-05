## Brewery excise calculator

This readme serves as a changelog for this project.

The purpose of this project is to automate the calculation of excise tax for breweries.

## How to calculate excise duty - AUSTRALIA.

[Find current excise rates here](https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/excise-on-alcohol/excise-duty-rates-for-alcohol)

## Beer – formula for excise duty

The excise duty for beer is worked out on the alcoholic content above 1.15%:
Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate.

Example: calculating excise duty for beer
Brewery Co delivers 10 cases of beer, each containing 24×355 ml bottles with 5% alcohol by volume into the Australian domestic market on 8 March 2023.
The beer is classified to sub-item 1.10 in the Schedule to the Excise Tariff Act 1921 and has a duty rate of $57.79 per litre of alcohol (as at 1 February 2023).

The duty payable is calculated as follows:
10 cases × 24 bottles × 0.355 litres each = 85.2 litres
85.2 litres × (5% − 1.15%) = 328.02 OR 3.28 LALs.

For the purpose of calculating duty payable, the LALs are truncated to one decimal place.
The LALs are then multiplied by the relevant duty rate, in March 2023, to find out the duty payable:
3.2 × $57.79 = $184.92.


## Overview

Section 1: Batch Information
* Product name
* Batch date
* OG / FG
* ABV
* Ingredients

Section 2: Brew Process
* Mash Temp
* Boil Time
* Fermentation Temp
* Yeast
* Notes

Section 3: Excise Calculation
* Duty rate
* Packaged litres
* LALs
* Duty payable

This gives the brewer a clear mental model:
* “What beer did we make?”
* “How did we brew it?”
* “How much tax do we owe?”
