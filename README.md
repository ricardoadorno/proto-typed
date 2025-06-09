# Proto-type

## Description
This is a high-level app for creating interactive prototypes based on simple descriptive syntax.

## Stack

- React
- TypeScript
- Vite
- Vitest
- React Testing Library

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd proto
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the development server:
```bash
npm run dev
```

## Testing

To run tests:
```bash
npm test
```

## Syntax

The app uses a simple descriptive syntax to define UI components. Below is an example of the syntax:

### Core

#### Screens
```
screen Foo
```

### Typography
```
### heading 1
### heading 2
### heading 3
### text
text lorem ipson
```

### Media
```
### image
image ["https://example.com"] Foo
```

### Interactive Elements
```
### link
link ["https://example.com"] Foo

### button
button ["https://example.com"] Foo
```

### Form Elements
```
### input
input text Foo
input password Bar

### radio
radio 
    ()
    (X)

### checkbox
checkbox
    [X]
    []

### select
select
    <[foo]>
    <[bar]>

### switch
switch

### range
range 0 100
```

### Layout
```
### separator
---

### row & column
row []
    col []

col []
```

### Complex Components
```
### card
card
    row
        # lorem 
    row full
        input text Foo
        inout password Bar
    row
        button submit
        button reset
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

