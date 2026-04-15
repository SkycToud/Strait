# Design System Specification: The Academic Curator
 
## 1. Overview & Creative North Star
The "Academic Curator" is a design system crafted for the Tokyo University of Foreign Studies student body. It moves away from the rigid, utilitarian "portal" feel of traditional university software toward a high-end editorial experience. 
 
**Creative North Star: The Digital Curator**  
Just as a curator organizes a gallery to facilitate discovery and quiet contemplation, this system prioritizes clarity through **Soft Minimalism**. We break the "template" look by utilizing intentional asymmetry in card layouts, high-contrast typography scales for bilingual readability, and a philosophy of depth over borders. The experience should feel like a premium, physical stationery set—smooth, tactile, and highly organized.
 
 
## 2. Colors
Our palette is anchored by the primary blue (`#0e61a5`), but its success relies on the sophisticated interplay of neutral surfaces.
 
### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are prohibited for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit on a `surface` background to define its territory. Contrast, not lines, creates the container.
 
### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
*   **Base:** `surface` (#f9f9fe) for the main viewport.
*   **Sectioning:** `surface-container-low` (#f2f3fa) for large content areas.
*   **Elevated Elements:** `surface-container-lowest` (#ffffff) for primary cards to create a "pop-out" effect against the slightly darker container.
 
### The "Glass & Gradient" Rule
To elevate the aesthetic from a generic grid, use **Glassmorphism** for floating elements (like Navigation Bars or Tooltips). Use semi-transparent surface colors with a `backdrop-blur` of 12px-20px. 
*   **CTAs & Heroes:** Use subtle linear gradients transitioning from `primary` (#0e61a5) to `primary-container` (#73b1fb) at a 135-degree angle to provide visual "soul" and professional polish.
 
 
## 3. Typography
The system uses **Inter** (or a high-precision Japanese sans-serif like Noto Sans JP) to balance academic authority with modern accessibility.
 
*   **Display Scales (`display-lg` to `display-sm`):** Reserved for high-impact landing moments. Use `Font-Weight: 700` to create a bold, editorial anchor.
*   **The Bilingual Hierarchy:** Headings should lead with Japanese, followed by a smaller, lighter-weight English sub-heading using `label-md`.
*   **Body & Labels:** `body-md` (#2e333a) is our workhorse for readability. Ensure a line height of at least 1.6 for Japanese text to reduce cognitive load during long study sessions.
 
 
## 4. Elevation & Depth
In this system, depth is a functional tool, not a decorative one.
 
### The Layering Principle
Achieve hierarchy by stacking surface tokens. Placing a `surface-container-lowest` card on a `surface-container-high` background creates a natural lift that feels sophisticated and calm.
 
### Ambient Shadows
Shadows must mimic natural, ambient light. 
*   **Shadow Specs:** Use extra-diffused blur values (e.g., `blur: 32px`) and low opacity (4%–8%). 
*   **Tinting:** Never use pure black for shadows. The shadow color must be a tinted version of `on-surface` (#2e333a) to ensure the shadow feels integrated into the background.
 
### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use a **Ghost Border**. Use the `outline-variant` (#aeb2bb) token at **15% opacity**. Total 100% opaque borders are strictly forbidden.
 
 
## 5. Components
 
### Cards & Lists
*   **Style:** Rounded corners at `lg` (1rem) or `xl` (1.5rem). 
*   **Separation:** Forbid the use of divider lines. Separate list items using vertical white space (Token `4` - 1.4rem) or subtle background shifts.
*   **Asymmetry:** In facility cards, use an organic "cut-out" shape in the corner (utilizing `tertiary-container`) to house status indicators (e.g., "Open/Closed").
 
### Navigation
*   **States:** The `active` state must be a pill-shaped background using `secondary-container` (#d7e3f8) with `on-secondary-container` text. Avoid simple underlines.
*   **Blur:** The top navigation bar should always utilize the Glassmorphism rule (Surface color @ 80% opacity + blur).
 
### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), white text, `full` roundness (9999px) for a friendly, modern touch.
*   **Secondary:** Ghost style with `surface-container-highest` background on hover.
 
### Relevant App Components
*   **Status Pills:** For campus facility status, use `tertiary` for neutral states and `error` for closed states, always within a soft, low-opacity container.
*   **Timeline Track:** In calendar views, the vertical line must be the `outline-variant` at 20% opacity, with "active" nodes using the `primary` accent.
 
 
## 6. Do's and Don'ts
 
### Do:
*   **Do** use the Spacing Scale religiously. Consistent gaps (like `6` or `8` for section margins) are what make a layout feel "world-class."
*   **Do** use `on-surface-variant` (#5b5f67) for secondary English translations to keep the focus on the primary Japanese content.
*   **Do** allow elements to overlap slightly (e.g., an icon breaking the boundary of a card) to create a custom, high-end feel.
 
### Don't:
*   **Don't** use pure black (#000000) for text. Use `on-background` (#2e333a) to maintain a soft, premium "ink on paper" contrast.
*   **Don't** use sharp 90-degree corners. Everything must feel approachable; the minimum radius is `sm` (0.25rem).
*   **Don't** clutter the screen. If in doubt, increase the spacing token by one level (e.g., move from `4` to `5`). Whitespace is a luxury student users deserve.
