"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthLimitData = exports.growthLimit = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
/**
 * The first of `limits` that holds the city back: one whose size it has reached without the improvement it names, or
 * `null` when none does. A ruleset's `Grow` rule (which shrinks a city that has just grown past the cap back) and the
 * data a renderer is sent (`growthLimitData`) can both read this, so they can't disagree.
 */
const growthLimit = (cityGrowth, limits, cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    var _a;
    return (_a = limits.find(([size, Improvement]) => cityGrowth.size() >= size &&
        !cityImprovementRegistry
            .getByCity(cityGrowth.city())
            .some((improvement) => improvement instanceof Improvement))) !== null && _a !== void 0 ? _a : null;
};
exports.growthLimit = growthLimit;
/** `growthLimit` as a renderer is sent it, or `null` when nothing holds the city back. */
const growthLimitData = (cityGrowth, limits, cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    const limit = (0, exports.growthLimit)(cityGrowth, limits, cityImprovementRegistry);
    return limit === null
        ? null
        : { size: limit[0], needs: (0, DataObject_1.typeNameOf)(limit[1]) };
};
exports.growthLimitData = growthLimitData;
exports.default = exports.growthLimit;
//# sourceMappingURL=growthLimit.js.map