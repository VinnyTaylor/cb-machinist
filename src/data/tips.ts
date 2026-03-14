export const machiningTips: string[] = [
  "When threading stainless steel, reduce speed 30-40% and use sulfur-based cutting oil for better finish and tool life.",
  "For aluminum, use 2-3 flute end mills with polished flutes to prevent built-up edge (BUE) and chip welding.",
  "Always climb mill when possible for better surface finish - but ensure your machine has minimal backlash.",
  "On deep holes (>3x diameter), use peck drilling with full retract (G83) to clear chips and prevent tool breakage.",
  "When facing on a lathe, start from center and work outward for best surface finish. Use CSS (G96) mode.",
  "Cast iron should be machined DRY - coolant causes thermal shock that can crack carbide inserts.",
  "For tight tolerance bores, rough 0.010\" undersize, then take a spring pass before final sizing.",
  "Thread mills last 10x longer than taps and can be adjusted for thread fit - great for expensive parts.",
  "When using carbide in steel, minimum 300 SFM is needed to form proper chips - too slow causes rubbing.",
  "Keep tool stickout under 3x diameter when possible. Chatter increases exponentially with length.",
  "For 304/316 stainless: never dwell in the cut - work hardening happens fast. Keep tool moving!",
  "Check your G28 position before running - an incorrect home can crash your spindle into the vise.",
  "On brass and bronze, use zero or negative rake tools to prevent 'grabbing' and tool dig-in.",
  "When roughing, maximize width of cut over depth of cut for better MRR with less tool deflection.",
  "Always verify your tool length offset (H value) before running a new program - Z crashes are costly!"
];

export const getRandomTip = (): string => {
  return machiningTips[Math.floor(Math.random() * machiningTips.length)];
};
