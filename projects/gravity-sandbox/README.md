# Gravity Sandbox - ODSE Styles Testing

This is a sandbox application for testing XAML UI components with ODSE-styled colors and design system.

## Purpose

The **gravity-sandbox** is identical to **xaml-sandbox** except it uses `GravityGlobals.css` instead of `XamlGlobals.css`. This allows testing how Ridge/XAML components look with ODSE's design system (PrimeNG Aura theme colors, Red Hat Display font, etc.).

## Key Differences from xaml-sandbox

- **Stylesheet**: Uses `GravityGlobals.css` (ODSE colors) instead of `XamlGlobals.css` (Fluent/Ridge colors)
- **Color Scheme**: 
  - Primary accent: Blue (`#3b82f6` / `#2563eb`)
  - Neutral palette from PrimeNG Aura
  - Custom ODSE surface colors
- **Typography**: Red Hat Display Variable font family

## Running the Application

```bash
# Start development server
npm run start:gravity

# Build for production
npm run build:gravity
```

The app will be available at `http://localhost:4200/`

## Use Case

Use this sandbox when:
- Testing Ridge components for ODSE integration
- Verifying color mappings from Fluent to ODSE design system
- Comparing visual appearance between original Ridge styles and ODSE-styled Ridge components
- Ensuring Ridge components match ODSE's visual language when embedded

## Comparison

To compare styles:
1. Run `npm start` (xaml-sandbox with original Ridge styles)
2. Run `npm run start:gravity` (gravity-sandbox with ODSE styles)
3. Compare the visual appearance of the same components
