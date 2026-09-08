/**
 * Where the studio has worked, swept outward from home — never alphabetically,
 * never grouped by country — so the European corridor, the Asia practice and
 * the lusophone world emerge unlabelled.
 *
 * Each carries its coordinates because the same array feeds two screens: the
 * map plots these points and the list names them, in this order. Keeping the
 * places and their positions in one array is what stops a city being added to
 * the list and quietly missing from the map.
 *
 * Some of these are regions rather than cities — Algarve, Tuscany. The point
 * plotted is the middle of the region; the studio's own page calls them all
 * places it has worked, and so does this.
 *
 * This lived in content/craft.ts until Craft was taken off the panel on 8
 * September. The section went; the reach it closed with did not, and is now
 * the bottom of Studio.
 */
export type City = { name: string; lon: number; lat: number };

export const CITIES: City[] = [
  { name: 'Cascais', lon: -9.42, lat: 38.7 },
  { name: 'Lisboa', lon: -9.14, lat: 38.72 },
  { name: 'Comporta', lon: -8.79, lat: 38.38 },
  { name: 'Algarve', lon: -8.0, lat: 37.1 },
  { name: 'Porto', lon: -8.61, lat: 41.15 },
  { name: 'Málaga', lon: -4.42, lat: 36.72 },
  { name: 'Madrid', lon: -3.7, lat: 40.42 },
  { name: 'Paris', lon: 2.35, lat: 48.86 },
  { name: 'London', lon: -0.13, lat: 51.51 },
  { name: 'Monaco', lon: 7.42, lat: 43.74 },
  { name: 'Tuscany', lon: 11.25, lat: 43.77 },
  { name: 'Lugano', lon: 8.95, lat: 46.01 },
  { name: 'Geneva', lon: 6.14, lat: 46.2 },
  { name: 'Luanda', lon: 13.23, lat: -8.84 },
  { name: 'Macau', lon: 113.54, lat: 22.2 },
  { name: 'Bangkok', lon: 100.5, lat: 13.76 },
  { name: 'Singapore', lon: 103.82, lat: 1.35 },
  { name: 'Rio de Janeiro', lon: -43.17, lat: -22.91 },
  { name: 'São Paulo', lon: -46.63, lat: -23.55 },
];
