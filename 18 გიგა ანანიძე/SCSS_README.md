# SCSS Structure Documentation

This project uses a modular SCSS architecture with mixins for better maintainability and reusability.

## 📁 Folder Structure

```
scss/
├── _variables.scss          # Design tokens (colors, spacing, breakpoints)
├── _mixins.scss            # Reusable mixins for common patterns
├── _base.scss              # Global styles and utility classes
├── _layout.scss            # Layout-specific styles
├── _animations.scss        # Keyframe animations
├── main.scss              # Main import file
└── components/
    ├── _sidebar.scss
    ├── _search.scss
    ├── _current-weather.scss
    ├── _forecast.scss
    ├── _air-conditions.scss
    └── _weekly-forecast.scss
```

## 🎨 Available Mixins

### Layout Mixins
```scss
@include flex-center;           // display: flex; align-items: center; justify-content: center;
@include flex-between;          // display: flex; align-items: center; justify-content: space-between;
@include flex-column;           // display: flex; flex-direction: column;
@include flex-column-center;    // flex-column + align-items: center;

@include grid-auto-fit(250px, 16px);     // Auto-fit grid with min-width and gap
@include grid-equal-columns(3, 16px);    // Equal columns grid
```

### Card Mixins
```scss
@include card-base;             // Basic card styling
@include card-hover;            // Hover effects for cards
@include card-interactive;      // Clickable card with hover effects
```

### Button Mixins
```scss
@include button-primary;        // Primary button styling
@include button-secondary;      // Secondary button styling
@include button-base;           // Base button styles
```

### Input Mixins
```scss
@include input-base;            // Standard input field styling
```

### Typography Mixins
```scss
@include heading-large;         // 48px heading
@include heading-medium;        // 24px heading
@include heading-small;         // 18px heading
@include text-body;             // 16px body text
@include text-small;            // 14px small text
@include text-caption;          // 12px caption text (uppercase)
```

### Weather Icon Mixins
```scss
@include weather-icon-base(40px);   // Base weather icon (customizable size)
@include weather-icon-sunny;        // Sunny weather icon
@include weather-icon-cloudy;       // Cloudy weather icon
@include weather-icon-rainy;        // Rainy weather icon
```

### Animation Mixins
```scss
@include fade-in(0.6s);         // Fade in animation
@include slide-up(0.6s);        // Slide up animation
@include pulse(2s);             // Pulse animation
```

### Responsive Mixins
```scss
@include mobile {               // Styles for mobile devices (≤768px)
  // Your mobile styles here
}

@include tablet {               // Styles for tablets (≤1200px)
  // Your tablet styles here
}

@include desktop {              // Styles for desktop (>1200px)
  // Your desktop styles here
}
```

### Utility Mixins
```scss
@include visually-hidden;       // Screen reader only content
@include truncate-text;         // Text overflow ellipsis
@include aspect-ratio(16, 9);   // Aspect ratio container
@include custom-scrollbar(6px, transparent, rgba(255,255,255,0.2));
```

## 🎯 Usage Examples

### Creating a New Component
```scss
@use '../variables' as *;
@use '../mixins' as *;

.my-component {
  @include card-base;
  @include flex-column;
  gap: $spacing-md;
  
  .title {
    @include heading-medium;
    color: $text-primary;
  }
  
  .button {
    @include button-primary;
  }
  
  @include mobile {
    padding: $spacing-sm;
  }
}
```

### Using Weather Icons
```scss
.weather-display {
  .icon {
    @include weather-icon-base(60px);
    
    &.sunny {
      @include weather-icon-sunny;
    }
    
    &.cloudy {
      @include weather-icon-cloudy;
    }
  }
}
```

### Responsive Grid Layout
```scss
.card-grid {
  @include grid-auto-fit(300px, $spacing-lg);
  
  @include mobile {
    @include grid-equal-columns(1, $spacing-md);
  }
}
```

## 🔧 Variables Available

### Colors
- `$primary-bg`, `$secondary-bg`, `$card-bg`
- `$text-primary`, `$text-secondary`
- `$accent-blue`, `$accent-orange`

### Spacing
- `$spacing-xs` (8px) to `$spacing-xl` (32px)

### Border Radius
- `$border-radius` (16px), `$border-radius-sm` (12px), `$border-radius-lg` (20px)

### Breakpoints
- `$breakpoint-mobile` (768px), `$breakpoint-tablet` (1200px)

### Transitions
- `$transition-fast` (0.3s ease), `$transition-slow` (0.6s ease-out)

## 🚀 Benefits of This Structure

1. **Maintainability**: Changes to design tokens affect the entire app
2. **Reusability**: Mixins eliminate code duplication
3. **Consistency**: Standardized patterns across components
4. **Scalability**: Easy to add new components and features
5. **Performance**: Optimized CSS output with no duplication

## 📝 Adding New Components

1. Create a new file in `scss/components/_component-name.scss`
2. Import variables and mixins: `@use '../variables' as *; @use '../mixins' as *;`
3. Use existing mixins and variables for consistency
4. Add the import to `scss/main.scss`

## 🎨 Customizing

To customize the design system:
1. Modify variables in `_variables.scss`
2. Add new mixins to `_mixins.scss`
3. The changes will automatically apply throughout the app