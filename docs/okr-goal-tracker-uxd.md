# OKR and Weekly Goal Tracker - User Experience Description Document

## Layout Structure

The application uses a responsive single-page layout with three main sections:

1. **Header Bar** (Top)
   - Displays application name "OKR Goal Tracker"
   - Clean, minimal design with dark mode

2. **Main Content Area** (Full width)
   - Three stacked sections:
     - OKRs Panel (top)
     - Weekly Goals Panel (middle)
     - Reports Panel (bottom)
   - Each panel maintains consistent spacing and padding

## Core Components

### 1. OKRs Panel

- **OKR List Container**
  - Card component with "OKRs" header
  - Add OKR button with plus icon
  - Clean grid layout for OKR cards
  - Consistent spacing between cards

- **Individual OKR Component**
  - Title text (large, semibold)
  - Description text (optional, regular weight)
  - Progress control:
    - Horizontal slider with custom styling
    - Percentage display (right-aligned)
    - Color transitions:
      - Red (0-30%)
      - Amber (31-70%)
      - Green (71-100%)

- **Add/Edit OKR Controls**
  - Modal dialog for add/edit
  - Form fields:
    - Title (required)
    - Description (optional)
    - Initial progress (default 0%)
    - Save/Cancel buttons

### 2. Weekly Goals Panel

- **Goals List Container**
  - Card component with "Weekly Goals" header
  - Add Goal button with plus icon
  - Table layout with columns:
    - Goal Description
    - Assigned To
    - Related OKR
    - Status

- **Individual Goal Component**
  - Goal text (primary text)
  - Team member dropdown
  - OKR dropdown
  - Status indicator:
    - Color dot (Red/Amber/Green)
    - Status text
    - Click to change status

- **Add/Edit Goal Controls**
  - Modal dialog for add/edit
  - Form fields:
    - Description (required)
    - Team member selection
    - OKR selection
    - Initial status
    - Save/Cancel buttons

### 3. Reports Panel

- **Dashboard Container**
  - Card component with "Reports" header
  - Three charts in horizontal layout:
    - Team Members by OKR (bar chart)
    - Goals by OKR (bar chart)
    - Goal Status Overview (pie chart)

- **Chart Components**
  - Consistent styling across all charts
  - Interactive tooltips
  - Responsive sizing
  - Status-based color coding
  - Clear labels and legends

## Interaction Patterns

### 1. Progress Tracking

- **OKR Progress Slider**
  - Smooth drag interaction
  - Real-time percentage updates
  - Color transitions on threshold changes
  - Immediate data persistence

- **Goal Status Toggle**
  - Click to cycle through states
  - Instant visual feedback
  - Updates reflected in charts

### 2. Team Member Management

- **Adding Team Members**
  - Modal dialog with name input
  - Validation for required fields
  - Immediate list update on save

- **Removing Team Members**
  - Confirmation dialog
  - Graceful handling of assigned goals

### 3. Data Management

- **Real-time Updates**
  - Instant reflection of changes
  - Smooth transitions
  - Consistent state across views

## Visual Design Elements

### 1. Color Palette

- **Theme Colors**
  - Background: #020817
  - Card background: #1E293B
  - Text: #FFFFFF (primary), #94A3B8 (secondary)

- **Status Colors**
  - Red: #EF4444 (Not Started, < 30%)
  - Amber: #F59E0B (In Progress, 31-70%)
  - Green: #10B981 (Completed, > 70%)

- **Accent Colors**
  - Primary: #3B82F6
  - Focus: #60A5FA

### 2. Typography

- **Font Family**
  - Inter for all text
  - Font weights:
    - Regular (400) for body text
    - Medium (500) for emphasis
    - Semibold (600) for headings

- **Size Scale**
  - Headings: 1.5rem
  - Body: 1rem
  - Labels: 0.875rem

### 3. Component Styling

- **Cards**
  - Rounded corners (0.5rem)
  - Subtle border (#1E293B)
  - Consistent padding (1.5rem)

- **Interactive Elements**
  - Hover states with opacity changes
  - Focus rings for keyboard navigation
  - Transition duration: 150ms

### 4. Accessibility

- **Keyboard Navigation**
  - Logical tab order
  - Focus indicators
  - ARIA labels

- **Color Contrast**
  - WCAG AA compliance
  - Clear text legibility
  - Status colors with sufficient contrast

## Responsive Behavior

### Desktop (Primary)
- Full three-column layout for reports
- Comfortable spacing
- Optimal chart sizes

### Tablet
- Stacked layout for reports
- Adjusted card sizes
- Preserved functionality

### Mobile
- Single column layout
- Scrollable sections
- Touch-friendly controls
