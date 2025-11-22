# PPP - Pretty Print Program

A simple, lightweight utility to pretty print and format various data formats.

## Features

- **JSON Pretty Printing**: Format and indent JSON data with sorted keys
- **XML Pretty Printing**: Format and indent XML documents
- **Auto-detection**: Automatically detect input format (JSON or XML)
- **Flexible Input**: Read from files or stdin
- **Command-line Interface**: Easy to use CLI

## Installation

No installation required! Just run the Python script:

```bash
python3 ppp.py
```

Or make it executable and run directly:

```bash
chmod +x ppp.py
./ppp.py
```

## Usage

### Basic Usage

Pretty print JSON from stdin:
```bash
echo '{"name":"John","age":30,"city":"NYC"}' | python3 ppp.py
```

Pretty print from a file:
```bash
python3 ppp.py data.json
```

### Specify Format

Force a specific format:
```bash
python3 ppp.py -f json input.json
python3 ppp.py -f xml input.xml
```

### Auto-detection (default)

PPP will automatically detect JSON or XML format:
```bash
cat data.json | python3 ppp.py
cat data.xml | python3 ppp.py
```

## Examples

### JSON Example

Input:
```json
{"name":"John","age":30,"items":[1,2,3]}
```

Output:
```json
{
  "age": 30,
  "items": [
    1,
    2,
    3
  ],
  "name": "John"
}
```

### XML Example

Input:
```xml
<root><item>test</item><value>123</value></root>
```

Output:
```xml
<?xml version="1.0" ?>
<root>
  <item>test</item>
  <value>123</value>
</root>
```

## Command-line Options

- `-f, --format {json,xml,auto}`: Specify input format (default: auto)
- `file`: Input file path (optional, uses stdin if not provided)
- `-h, --help`: Show help message

## Testing

Run the test suite:

```bash
python3 -m unittest test_ppp.py
```

Or with verbose output:

```bash
python3 -m unittest test_ppp.py -v
```

## Requirements

- Python 3.6 or higher
- No external dependencies (uses standard library only)

## License

Open source - feel free to use and modify!