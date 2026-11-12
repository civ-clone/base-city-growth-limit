import growthLimit, { GrowthLimit, growthLimitData } from '../lib/growthLimit';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { expect } from 'chai';

class Cistern extends CityImprovement {}
class Drains extends CityImprovement {}

const city = {},
  standInGrowth = (size: number): CityGrowth =>
    ({ size: () => size, city: () => city } as unknown as CityGrowth),
  standInRegistry = (
    ...Improvements: (typeof CityImprovement)[]
  ): CityImprovementRegistry =>
    ({
      getByCity: (asked: unknown): CityImprovement[] => {
        expect(asked).to.equal(city);

        return Improvements.map(
          (Improvement): CityImprovement =>
            Object.create(Improvement.prototype) as CityImprovement
        );
      },
    } as unknown as CityImprovementRegistry),
  limits: GrowthLimit[] = [
    [8, Cistern],
    [12, Drains],
  ];

describe('base-city-growth-limit', (): void => {
  (
    [
      [7, [], null],
      [8, [], [8, Cistern]],
      [9, [Drains], [8, Cistern]],
      [9, [Cistern], null],
      [11, [Cistern], null],
      [12, [Cistern], [12, Drains]],
      [13, [Cistern], [12, Drains]],
      [12, [Cistern, Drains], null],
      // Checked in order: the first cap reached without its improvement.
      [12, [], [8, Cistern]],
    ] as [number, (typeof CityImprovement)[], GrowthLimit | null][]
  ).forEach(([size, built, expected]): void => {
    it(`holds a size ${size} city with ${
      built.map((Improvement) => Improvement.name).join(' and ') || 'nothing'
    } at ${
      expected ? `${expected[0]} for ${expected[1].name}` : 'nothing'
    }`, (): void => {
      expect(
        growthLimit(standInGrowth(size), limits, standInRegistry(...built))
      ).to.deep.equal(expected);
    });
  });

  it('sends a renderer the cap and the type name of what it needs', (): void => {
    expect(
      growthLimitData(standInGrowth(13), limits, standInRegistry(Cistern))
    ).to.deep.equal({ size: 12, needs: 'Drains' });
    expect(
      growthLimitData(standInGrowth(5), limits, standInRegistry())
    ).to.equal(null);
  });

  it('holds nothing back with no caps', (): void => {
    expect(growthLimit(standInGrowth(100), [], standInRegistry())).to.equal(
      null
    );
  });
});
