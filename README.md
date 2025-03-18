# Church Multiplication Widget

An embeddable widget that visualizes the power of exponential multiplication for churches and Christian groups. The widget allows users to experiment with different initial numbers and reproduction rates to see the dramatic impact over a 10-year period.

## Features

- **Interactive Dropdowns**: Choose the initial number of Christian groups (1-20) and the time period for reproduction (1-24 months)
- **Visual Bar Chart**: See the exponential growth visualized across 10 years
- **Responsive Design**: Works on mobile and desktop devices
- **Easy to Embed**: Simple to add to any website

## Demo

You can see a live demo by opening the `example.html` file in your browser after building the project.

## Installation

1. Clone this repository:
```
git clone https://github.com/yourusername/multiply-widget.git
cd multiply-widget
```

2. Install dependencies:
```
npm install
```

3. Build the widget:
```
npm run build
```

This will create a `dist` folder with the compiled widget.

## Development

Run a local development server:

```
npm run dev
```

This will start a server at http://localhost:9000 where you can see the widget in action.

## Usage

To embed the widget on your website:

1. Include the script in your HTML:
```html
<script src="path-to/multiply-widget.js"></script>
```

2. Add a container element where you want the widget to appear:
```html
<div id="multiplication-widget"></div>
```

3. Initialize the widget:
```html
<script>
  new MultiplyWidget({
    container: 'multiplication-widget'
  });
</script>
```

## Customization

Currently, the widget uses default settings, but future versions may include options for:
- Custom colors
- Different chart types
- Timeframe adjustments

## License

MIT

## Purpose

This widget was created to help visualize the power of exponential growth in church planting movements. By allowing users to experiment with different multiplication rates, it demonstrates how small changes in reproduction frequency can lead to dramatically different outcomes over time. 