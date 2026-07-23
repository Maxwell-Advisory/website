// ---------------------------------------------------------------------------
// STATS (homepage "Our data" counters)
// ---------------------------------------------------------------------------
// Edit the numbers, labels, or suffixes below. Each counts up from 0 on scroll.
//
//   label  – text under the number
//   value  – the number it counts up to
//   suffix – shown after the number (e.g. "+")
//   prefix – shown before the number (usually empty)
//   id     – kept from the original markup so existing styling still applies;
//            for a brand-new stat, any unused short id works.
// ---------------------------------------------------------------------------

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  id: string;
  mobileInherit?: boolean;
}

export const stats: Stat[] = [
  { label: 'years buy‑side and advisory',        value: 20, suffix: '+', id: '55b4384', mobileInherit: true },
  { label: 'successful transactions',            value: 40, suffix: '+', id: '86a0f45', mobileInherit: true },
  { label: 'specialist investors across Europe', value: 60, suffix: '+', id: 'b74f127' },
];

export function renderStat(s: Stat): string {
  const mobile = s.mobileInherit ? ' elementor-widget-mobile__width-inherit' : '';
  return `<div class="elementor-element elementor-element-${s.id}${mobile} elementor-widget elementor-widget-counter" data-e-type="widget" data-element_type="widget" data-id="${s.id}" data-widget_type="counter.default">
<div class="elementor-widget-container">
<div class="elementor-counter">
<div class="elementor-counter-title">${s.label}</div> <div class="elementor-counter-number-wrapper">
<span class="elementor-counter-number-prefix">${s.prefix ?? ''}</span>
<span class="elementor-counter-number" data-duration="2000" data-from-value="0" data-to-value="${s.value}">0</span>
<span class="elementor-counter-number-suffix">${s.suffix ?? ''}</span>
</div>
</div>
</div>
</div>
`;
}
