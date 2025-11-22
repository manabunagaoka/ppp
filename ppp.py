#!/usr/bin/env python3
"""
PPP - Pretty Print Program
A simple utility to pretty print various data formats.
"""

import json
import sys
import xml.dom.minidom
import xml.parsers.expat
from argparse import ArgumentParser


def pretty_print_json(data):
    """Pretty print JSON data."""
    try:
        if isinstance(data, str):
            parsed = json.loads(data)
        else:
            parsed = data
        return json.dumps(parsed, indent=2, sort_keys=True)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON: {e}")


def pretty_print_xml(data):
    """Pretty print XML data."""
    try:
        dom = xml.dom.minidom.parseString(data)
        return dom.toprettyxml(indent="  ")
    except xml.parsers.expat.ExpatError as e:
        raise ValueError(f"Invalid XML: {e}")


def auto_detect_format(data):
    """Attempt to auto-detect the data format."""
    data_stripped = data.strip()
    
    # Check for JSON
    if data_stripped.startswith('{') or data_stripped.startswith('['):
        try:
            json.loads(data_stripped)
            return 'json'
        except json.JSONDecodeError:
            pass
    
    # Check for XML by attempting to parse it
    if data_stripped.startswith('<'):
        try:
            xml.dom.minidom.parseString(data_stripped)
            return 'xml'
        except xml.parsers.expat.ExpatError:
            pass
    
    return None


def main():
    """Main entry point for PPP."""
    parser = ArgumentParser(
        description='PPP - Pretty Print Program: Format and prettify data',
        epilog='Example: echo \'{"a":1,"b":2}\' | ppp -f json'
    )
    
    parser.add_argument(
        '-f', '--format',
        choices=['json', 'xml', 'auto'],
        default='auto',
        help='Input format (default: auto-detect)'
    )
    
    parser.add_argument(
        'file',
        nargs='?',
        help='Input file (default: stdin)'
    )
    
    args = parser.parse_args()
    
    # Read input
    if args.file:
        try:
            with open(args.file, 'r') as f:
                data = f.read()
        except FileNotFoundError:
            print(f"Error: File '{args.file}' not found", file=sys.stderr)
            sys.exit(1)
        except IOError as e:
            print(f"Error reading file: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        data = sys.stdin.read()
    
    if not data.strip():
        print("Error: No input provided", file=sys.stderr)
        sys.exit(1)
    
    # Detect format if auto
    format_type = args.format
    if format_type == 'auto':
        format_type = auto_detect_format(data)
        if format_type is None:
            print("Error: Could not auto-detect format. Please specify with -f", file=sys.stderr)
            sys.exit(1)
    
    # Pretty print
    try:
        if format_type == 'json':
            output = pretty_print_json(data)
        elif format_type == 'xml':
            output = pretty_print_xml(data)
        else:
            print(f"Error: Unsupported format '{format_type}'", file=sys.stderr)
            sys.exit(1)
        
        print(output)
        
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
