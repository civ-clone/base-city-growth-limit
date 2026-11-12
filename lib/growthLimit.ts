import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { typeNameOf } from '@civ-clone/core-data-object/DataObject';

/**
 * A size cap: a city that has reached `size` grows no larger until it has the improvement. A ruleset lists its caps in
 * the order they are checked, usually smallest first (one improvement at 10, say, or one at 8 and another at 12).
 */
export type GrowthLimit<
  Improvement extends typeof CityImprovement = typeof CityImprovement
> = [size: number, Improvement: Improvement];

/**
 * The first of `limits` that holds the city back: one whose size it has reached without the improvement it names, or
 * `null` when none does. A ruleset's `Grow` rule (which shrinks a city that has just grown past the cap back) and the
 * data a renderer is sent (`growthLimitData`) can both read this, so they can't disagree.
 */
export const growthLimit = <
  Improvement extends typeof CityImprovement = typeof CityImprovement
>(
  cityGrowth: CityGrowth,
  limits: GrowthLimit<Improvement>[],
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): GrowthLimit<Improvement> | null =>
  limits.find(
    ([size, Improvement]: GrowthLimit<Improvement>): boolean =>
      cityGrowth.size() >= size &&
      !cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some(
          (improvement: CityImprovement): boolean =>
            improvement instanceof Improvement
        )
  ) ?? null;

/**
 * What a renderer is told about the cap holding a city back: `size` is the cap itself (a city can be past it, captured
 * or joined by settlers, and still not grow), and `needs` the improvement's type name.
 */
export type GrowthLimitData = { size: number; needs: string };

/** `growthLimit` as a renderer is sent it, or `null` when nothing holds the city back. */
export const growthLimitData = (
  cityGrowth: CityGrowth,
  limits: GrowthLimit[],
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): GrowthLimitData | null => {
  const limit = growthLimit(cityGrowth, limits, cityImprovementRegistry);

  return limit === null
    ? null
    : { size: limit[0], needs: typeNameOf(limit[1]) };
};

export default growthLimit;
