# Responsive design and device evaluation

## Scope and status

The existing static HTML/CSS/JavaScript application was evaluated without changing its branding, problem content, editor library, execution engine, or deployment model. Responsive layouts and selected touch workflows were tested in Playwright's installed Chromium browser. These are emulated browser tests, not physical-device results.

## Viewports tested

The workspace, All Levels, and Settings were checked for page-wide horizontal overflow at each listed width. The workspace also checks panel placement and key target dimensions.

| Width | Height | Emulated layout |
| ---: | ---: | --- |
| 320 | 720 | small phone |
| 360 | 800 | small phone |
| 375 | 812 | phone |
| 390 | 844 | phone |
| 414 | 896 | large phone |
| 430 | 932 | large phone |
| 480 | 900 | large phone |
| 600 | 960 | small tablet |
| 768 | 1024 | tablet portrait |
| 820 | 1180 | tablet portrait |
| 900 | 600 | compact landscape |
| 1024 | 768 | tablet landscape |
| 1280 | 800 | laptop |
| 1440 | 900 | desktop |
| 1920 | 1080 | desktop |
| 2560 | 1440 | large desktop |

The touch-enabled phone workflow used 390×844, then resized to 844×390 to exercise a landscape viewport. This is viewport emulation; it does not simulate an operating-system virtual keyboard or prove behavior on iOS/Android hardware.

## Browser and devices

- Browser tested: Playwright Chromium against the local static test server.
- Firefox and WebKit could not be launched because their browser executables were not installed.
- Chrome, Edge, Safari, and Firefox as separate installed products were not tested.
- Physical phones and tablets tested: none.
- Touch input tested: Playwright mobile/touch emulation only.
- Orientation tested: portrait and landscape viewport sizes in emulation only.

## Findings and changes

- At 768–900px the previous two-column arrangement constrained the challenge/editor panels and left substantial unused vertical space. The workspace now stacks at widths through 900px; the problem list becomes a locally scrollable horizontal strip. At 901px and above, the desktop three-panel layout remains available where it fits.
- At phone widths the navigation previously centered an overflowing row, clipping the first link. The links now wrap from the start; all five navigation links are checked to remain within the viewport through 480px.
- Removed the 320px body minimum so a classic scrollbar cannot force horizontal overflow at a 320px viewport.
- Allowed settings cards and labels to shrink within their mobile grid tracks, avoiding intrinsic-width overflow in narrower browser font environments.
- Key navigation, problem, execution, editor-toolbar, hint, test-case, level, and tab controls meet a 44px minimum dimension at the tablet/mobile breakpoint; automated checks measure representative target widths and heights.
- Problem instructions use larger text on narrower displays; mobile page headings and cards stack.
- Added safe-area padding for notched displays and `viewport-fit=cover`; `100dvh` supplements the existing viewport-height fallback.
- Reduced-motion preferences now suppress animations and repeated animation iterations, including the in-app preference.
- Verified that editor output tabs do not recreate Ace or discard editor state.
- Confirmed page-wide horizontal reflow under the specified WCAG text-spacing overrides at 320px.
- Confirmed no page-wide horizontal overflow at all 16 widths for the workspace, All Levels, and Settings in the automated suite.

## Mobile gameplay sample

In an isolated touch-enabled Chromium context at 390×844, the test opened the first challenge, submitted a correct solution, verified saved progress and draft, opened Settings, exported the `.py` file, reloaded the challenge, and verified the saved code. The viewport was then changed to 844×390 and checked for page-wide overflow. The editor content in this automated workflow is set through Ace's API; actual mobile keyboard text entry was not tested.

## Desktop preservation

Responsive workspace changes are limited to the breakpoint at 900px and below, plus safe-area/reduced-motion rules. Automated checks confirmed that at widths from 1024px the challenge and editor panels remain side-by-side, and no page-wide horizontal overflow occurs at 1024–2560px. A pre-change screenshot baseline was not available for a pixel-by-pixel comparison.

## Remaining limitations

- Real-device behavior, dynamic browser chrome, virtual keyboard occlusion, device rotation, pinch zoom, and safe-area rendering require physical iOS/Android testing.
- Automated viewport checks cannot establish compatibility across browser engines; only Chromium was installed.
- No full performance, network-throttling, CPU-throttling, or memory-profile evaluation was performed.
