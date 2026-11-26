# Accessibility evaluation

## Conformance statement

This is a scoped engineering evaluation against WCAG 2.2 Level AA, with practical improvements for keyboard use, reduced motion, and touch targets. It is **not a declaration of full WCAG conformance**. The automated checks and simulated keyboard interactions below do not replace a complete manual review with assistive technology or real devices.

## Components and states evaluated

The Playwright/Axe suite scanned 15 representative states: the coding workspace, All Levels, Daily Challenge, Interview Practice, the empty Practice Results page, Settings, four information dialogs, expanded hints, the Console tab, 320px and 768px workspace viewports, and the level-completion dialog. The Axe scans reported zero violations in these sampled states.

The test also checks reduced-motion styles, skip navigation, route focus, dialog focus entry/trapping/return, keyboard operation of the editor and output tabs, narrow-screen reflow, touch-target dimensions for key controls, and text-spacing overrides.

## Criteria considered

| WCAG 2.2 criterion | Evaluation and result |
| --- | --- |
| 1.1.1 Non-text Content | Informative/decorative logo and icon semantics were reviewed in the rendered application; Axe found no related issue in the scanned states. A complete image-by-image expert review was not performed. |
| 1.3.1 Info and Relationships | Native headings, landmarks, labels, progress indicators, tabs, and dialog relationships were evaluated by Axe on the sampled views; zero reported violations. |
| 1.4.3 Contrast (Minimum) | Axe color-contrast checks reported no violations in sampled states. No independent manual measurement of every theme, syntax token, or interaction state was performed. |
| 1.4.10 Reflow | Workspace, All Levels, and Settings were checked at 320–2560 CSS pixels without page-wide horizontal overflow in the automated viewport suite. |
| 1.4.12 Text Spacing | A 320px layout was checked with 1.5 line height, 2× paragraph spacing, 0.12em letter spacing, and 0.16em word spacing; content and Run Code remained reachable without page-wide horizontal overflow. |
| 2.1.1 Keyboard | Automated keyboard checks cover the skip link, editor indentation and exit, execution shortcuts, and arrow/Home/End navigation for output tabs. This is not a complete manual keyboard audit of every control. |
| 2.1.2 No Keyboard Trap | The information dialog's Tab/Shift+Tab loop and Escape close behavior were tested. Other modal and assessment states were not exhaustively keyboard-audited. |
| 2.4.1 Bypass Blocks | The skip-to-main link was tested; focusing the main region leaves the hash route unchanged. |
| 2.4.3 Focus Order | Route changes move focus to main content; dialog focus handling and selected keyboard paths were tested. The entire focus order was not manually reviewed. |
| 2.4.7 Focus Visible | A visible `:focus-visible` indicator is defined for native controls. It was not manually inspected in every browser and state. |
| 2.4.11 Focus Not Obscured (Minimum) | Not fully verified on physical devices, with a virtual keyboard, or in every sticky/fixed layout state. |
| 2.5.8 Target Size (Minimum) | At the tablet/mobile breakpoint, key navigation, problem, execution, editor-toolbar, hint, test-case, and level controls have 44px minimum dimensions; the responsive test checks rendered widths and heights for representative targets. Every target and spacing exception was not manually measured. |
| 3.1.1 Language of Page | The static document declares English (`lang="en"`). |
| 4.1.2 Name, Role, Value | Axe checks the sampled views; level status text is included in level-control names, and output tabs expose selection and panel relationships. Zero Axe violations were reported in those states. |
| 4.1.3 Status Messages | Execution status, progress notices, and toasts use status/live-region semantics. Actual announcement quality was not verified with a screen reader. |

## Corrections made

- Made the current level tile's visible state and number part of its accessible name, and hid no meaningful status text from the accessibility tree.
- Added semantic grouping to problem navigation and completed the execution tab pattern with a labelled tabpanel, roving tab stop, and arrow/Home/End keyboard handling.
- Tab changes update only the output panel; they preserve the Ace editor instance, current code, and undo state.
- Moved focus to the main landmark on route changes and update the document title for the active view.
- Removed an `aria-live="off"` wrapper that could override descendant status announcements.
- Applied `autocapitalize="off"`, `autocomplete="off"`, `autocorrect="off"`, and `spellcheck="false"` to Ace's text input.
- Applied the app's reduced-motion preference to animation duration and iteration count as well as transitions.
- Increased key touch targets at tablet/mobile widths and kept visible focus styling.

## Manual and assistive-technology testing

- Playwright keyboard interactions verified the skip link, editor Escape-to-Run behavior, dialog focus return and focus loop, and output-tab arrow navigation.
- A touch-enabled mobile browser context completed a correct submission, retained the draft/progress, and exported the Python file.
- NVDA, VoiceOver, TalkBack, Narrator, and JAWS were not available for this evaluation; no screen-reader claim is made.
- No physical phone or tablet was available. Mobile keyboard, pinch zoom, and device-notched safe areas are not verified on real hardware.

## Remaining limitations

- Automated scans cover representative routes and states, not every problem, every error message, every level status, every audio state, or every browser.
- Axe results are not a conformance certificate. Manual contrast, 200%/400% browser zoom, text resize, full keyboard traversal, and screen-reader testing remain necessary for a complete WCAG assessment.
- Only Chromium was installed for local browser automation; Firefox and WebKit executables were unavailable.
- No unresolved Axe violations were found in the tested states. This does not establish that no accessibility barriers remain elsewhere.
