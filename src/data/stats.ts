// ---------------------------------------------------------------------------
// STATS — the homepage "Our data" counters (src/components/home/StatCounters.astro)
// ---------------------------------------------------------------------------
// Each counts up from 0 when it scrolls into view.
//
//   label  – text under the number
//   value  – the number it counts up to
//   suffix – shown after the number (e.g. "+")
//   prefix – shown before the number (usually omitted)
// ---------------------------------------------------------------------------

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export const stats: Stat[] = [
  { label: 'years buy\u2011side and advisory',        value: 20, suffix: '+' },
  { label: 'successful transactions',            value: 40, suffix: '+' },
  { label: 'specialist investors across Europe', value: 60, suffix: '+' },
];
