# base-city-growth-limit

City size caps as data. A ruleset lists its caps as `[size, Improvement]` pairs, in the order they are checked:

- `lib/growthLimit`: `growthLimit(cityGrowth, limits)`, the first cap the city has reached without its improvement (or
  `null`), for a `Grow` rule to shrink a city that has just grown past it; `growthLimitData(cityGrowth, limits)`, the
  same as `{ size, needs }` for a renderer's `AdditionalData`.

A library: it registers no rules. See `civ1-city-improvement` for one ruleset's cap.
