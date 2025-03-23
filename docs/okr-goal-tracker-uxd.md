# OKR and Weekly Goal Tracker - User Experience Description Document

## Layout Structure

The application uses a fixed panel-based layout with clearly defined sections:

1. **Header Bar** (Top)
   - Displays application name "OKR and Goal Tracker" prominently
   - Shows team name and icon (right-aligned)
   - Contains a subtle divider to separate it from content below

2. **Team Members Panel** (Left Column)
   - Fixed width (~20% of screen width)
   - Extends full height below header
   - Contains scrollable list of team members
   - "Add Team Member" button at bottom of panel

3. **Main Content Area** (Right Column, ~80% of screen width)
   - Divided into three stacked sections:
     - OKRs Panel (top)
     - Weekly Goals Panel (middle)
     - Reports Panel (bottom)
   - Each panel maintains a consistent height proportion

## Core Components

### 1. Team Members Panel

- **Team Member List**
  - Simple vertical list of names
  - Each entry includes:
    - Name (primary text)
    - Optional small avatar/initial circle (left of name)
    - Context menu accessible via three-dot icon (for edit/delete)
  - Subtle hover state for better interaction feedback
  - Current selection state with accent color highlight

- **Add Team Member Control**
  - "+" icon button with label "Add Team Member"
  - When clicked, reveals inline form with:
    - Name input field (required)
    - Add/Cancel buttons
    - Form appears in-place rather than modal for simplicity

### 2. OKRs Panel

- **OKR List Container**
  - Card component with distinct header "OKR"
  - Add OKR button (+) in top-right corner
  - Scrollable content area for multiple OKRs
  - Clean section dividers between OKRs

- **Individual OKR Component**
  - Title text (left-aligned, semibold)
  - Description text (optional, smaller font, light weight)
  - Progress indicator consisting of:
    - Horizontal slider with large grab handle
    - Percentage label (right-aligned, inside a box)
    - Color coding on slider track:
      - Red (0%)
      - Amber (1-70%)
      - Green (71-100%)

- **Add/Edit OKR Controls**
  - Add: Inline form appears at bottom of list
  - Edit: Accessed via subtle edit icon next to OKR title
  - Forms include:
    - Title field (required)
    - Description field (optional)
    - Initial progress value (default 0%)
    - Submit/Cancel buttons

### 3. Weekly Goals Panel

- **Goals List Container**
  - Card component with distinct header "Weekly Goals"
  - Add Goal button (+) in top-right corner
  - Scrollable content area for multiple goals
  - Column headers for "Weekly Goal", "Assigned to", and "OKR"

- **Individual Goal Component**
  - Goal description text (left column)
  - Assigned team member (middle column, via dropdown)
  - Associated OKR (right column, via dropdown)
  - Status indicator showing:
    - Color dot (Red=Not Started, Amber=In Progress, Green=Completed)
    - Status text label
  - Status toggle accessible via clicking the status indicator

- **Add/Edit Goal Controls**
  - Add: Inline form appears at bottom of list
  - Edit: Accessed via subtle edit icon next to goal text
  - Forms include:
    - Description field (required)
    - Team member dropdown (required)
    - OKR dropdown (required)
    - Initial status dropdown
    - Comment field (optional)
    - Submit/Cancel buttons

### 4. Reports Panel

- **Dashboard Container**
  - Card component with distinct header "Reports"
  - Three equal-width dashboard cards arranged horizontally
  - Each dashboard has:
    - Title text
    - Visualization area (chart/graph)
    - Small info icon for explanation tooltip

- **Dashboard Visualizations**
  - **Team Members by OKR:** Horizontal bar chart
    - X-axis: Count of team members
    - Y-axis: OKR titles
    - Bars colored by OKR status
  
  - **Goals by OKR:** Horizontal bar chart
    - X-axis: Count of goals
    - Y-axis: OKR titles
    - Segments colored by goal status
  
  - **Goal Status Breakdown:** Donut chart
    - Segments for Not Started, In Progress, Completed
    - Percentage labels
    - Color-coded segments matching status colors

## Interaction Patterns

### 1. Progress Tracking

- **OKR Progress Slider**
  - Click and drag to adjust progress percentage
  - Snap to whole percentage values (0-100%)
  - Real-time color updates as slider moves
  - Real-time percentage display updates
  - Subtle animation during transitions
  - Updates database on release (not during drag)

- **Weekly Goal Status Toggle**
  - Click on status to reveal dropdown with three options
  - Selection instantly updates status color and text
  - Updates related dashboard visualizations

### 2. Team Member Management

- **Adding Team Members**
  - Click "+" button reveals inline form
  - Enter name and submit
  - New member appears in list immediately
  - New member becomes available in assignment dropdowns

- **Editing Team Members**
  - Click three-dot menu next to name
  - Select "Edit" to modify name in-place
  - Select "Delete" to show confirmation dialog

### 3. Goal Assignment

- **Creating Goals**
  - Click "+" in Weekly Goals panel
  - Complete required fields in form
  - On submit, goal appears in list
  - Dashboards update to reflect new goal

- **Linking Goals to OKRs**
  - Select OKR from dropdown when creating/editing goal
  - Clear visual connection in Weekly Goals list
  - Updates reflected in dashboards

### 4. Commenting

- **Adding Comments to Goals**
  - Click comment icon next to goal
  - Opens comment thread in side panel or inline expansion
  - Add new comment with timestamp
  - Comments visible to all team members

## Visual Design Elements & Color Scheme

### 1. Color Palette

- **Background Colors**
  - Primary background (Dark mode): #0E1116
  - Card/Container background: #1A1E23
  - Header background: #161A1F
  - Hover state background: #2C3038

- **Progress/Status Colors**
  - Red (Not Started/0%): #FF4136
  - Amber (In Progress/1-70%): #FFDC00
  - Green (Completed/71-100%): #2ECC40

- **Accent Colors**
  - Primary accent (buttons, selection): #3D9970
  - Secondary accent (icons, highlights): #39CCCC
  - Error state: #FF4136

- **Text Colors**
  - Primary text: #FFFFFF
  - Secondary text: #AAAAAA
  - Disabled text: #666666

### 2. Shadows and Elevation

- **Card Components**
  - Subtle drop shadow: 0px 4px 6px rgba(0, 0, 0, 0.3)
  - Border radius: 8px
  - 1px subtle border: rgba(255, 255, 255, 0.1)

- **Interactive Elements**
  - Buttons: 0px 2px 4px rgba(0, 0, 0, 0.2)
  - Dropdowns: 0px 6px 12px rgba(0, 0, 0, 0.4)
  - Slider handles: 0px 2px 4px rgba(0, 0, 0, 0.4)

### 3. Icons and Visual Cues

- **Icon Set**
  - Consistent line-style icons throughout
  - 20px size for standard icons
  - 16px size for contextual icons

- **Status Indicators**
  - 8px colored dots for status
  - Animated transitions when status changes

- **Interactive Cues**
  - Subtle hover effects on all clickable elements
  - Focus states with accent color outline
  - Cursor changes to pointer on interactive elements

## Mobile, Web App, Desktop Considerations

### Desktop (Primary Experience)

- **Layout**
  - Fixed-width panels maintain proportions
  - Minimum width: 1024px
  - Comfortable spacing and text size
  - All panels visible simultaneously

- **Interactions**
  - Hover states for all interactive elements
  - Keyboard shortcuts for common actions
  - Scroll containers for overflowing content

### Tablet/iPad

- **Layout**
  - Same overall structure but with adjusted proportions
  - Team Members panel collapses to icon bar when screen width < 900px
  - Tap team member icon to expand details

- **Interactions**
  - Touch-friendly targets (minimum 44x44px)
  - Swipe gestures for panel navigation when collapsed

### Mobile Web

- **Layout**
  - Stacked panels in a single column
  - Priority order: OKRs > Weekly Goals > Team Members > Reports
  - Navigation tabs at bottom for quick access to sections
  - Collapsible sections to save vertical space

- **Interactions**
  - Simplified controls optimized for touch
  - Reduced animation to improve performance
  - Pull-to-refresh for data updates

## Typography

### Font Stack

- **Primary Font**: Inter (with system fallbacks)
  - `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;`

### Text Styles

- **Application Title**
  - Font weight: 700 (Bold)
  - Size: 24px
  - Letter spacing: -0.5px

- **Panel Headings**
  - Font weight: 600 (Semibold)
  - Size: 18px
  - Text transform: None
  - Letter spacing: -0.25px

- **OKR Titles**
  - Font weight: 600 (Semibold)
  - Size: 16px

- **Goal Descriptions**
  - Font weight: 400 (Regular)
  - Size: 14px

- **Team Member Names**
  - Font weight: 500 (Medium)
  - Size: 14px

- **Status Text**
  - Font weight: 500 (Medium)
  - Size: 12px
  - Text transform: Capitalize

- **Percentage Values**
  - Font weight: 600 (Semibold)
  - Size: 14px
  - Monospace variant for alignment

### Text Behavior

- Truncation with ellipsis for long text in constrained spaces
- Tooltips for full text on hover when truncated
- Consistent left alignment for most text elements
- Right alignment for numerical values

## Accessibility

### Color and Contrast

- Minimum contrast ratio of 4.5:1 for all text
- Additional visual cues beyond color (icons, patterns)
- Alternative to color-based status indicators (text labels)

### Keyboard Navigation

- Logical tab order following visual layout
- Focus indicators with high visibility
- Keyboard shortcuts for common actions:
  - Add new item: Alt+N
  - Save/Submit: Enter
  - Cancel/Close: Esc

### Screen Reader Support

- Proper heading hierarchy (H1-H6)
- ARIA labels for interactive elements
- Status updates announced via ARIA live regions
- Alternative text for all visual elements and charts

### Input Methods

- Support for mouse, keyboard, and touch interactions
- Large enough interactive targets (min 44x44px)
- Adequate spacing between clickable elements

### Additional Considerations

- Reduced motion option for animations
- Respects user system preferences for reduced motion
- Scalable text that respects browser font size settings
- Proper form labels and error messaging
