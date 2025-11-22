"""
Unit tests for PPP - Pretty Print Program
"""

import unittest
import json
from ppp import pretty_print_json, pretty_print_xml, auto_detect_format


class TestPrettyPrintJSON(unittest.TestCase):
    """Tests for JSON pretty printing."""
    
    def test_pretty_print_simple_json(self):
        """Test pretty printing simple JSON."""
        input_data = '{"name":"John","age":30}'
        output = pretty_print_json(input_data)
        parsed = json.loads(output)
        self.assertEqual(parsed['name'], 'John')
        self.assertEqual(parsed['age'], 30)
        self.assertIn('\n', output)  # Should have newlines
    
    def test_pretty_print_nested_json(self):
        """Test pretty printing nested JSON."""
        input_data = '{"person":{"name":"John","age":30},"items":[1,2,3]}'
        output = pretty_print_json(input_data)
        parsed = json.loads(output)
        self.assertEqual(parsed['person']['name'], 'John')
        self.assertEqual(parsed['items'], [1, 2, 3])
    
    def test_pretty_print_json_array(self):
        """Test pretty printing JSON array."""
        input_data = '[1,2,3,4,5]'
        output = pretty_print_json(input_data)
        parsed = json.loads(output)
        self.assertEqual(parsed, [1, 2, 3, 4, 5])
    
    def test_invalid_json(self):
        """Test handling of invalid JSON."""
        with self.assertRaises(ValueError):
            pretty_print_json('{invalid json}')


class TestPrettyPrintXML(unittest.TestCase):
    """Tests for XML pretty printing."""
    
    def test_pretty_print_simple_xml(self):
        """Test pretty printing simple XML."""
        input_data = '<root><item>test</item></root>'
        output = pretty_print_xml(input_data)
        self.assertIn('<root>', output)
        self.assertIn('<item>test</item>', output)
        self.assertIn('<?xml', output)
    
    def test_pretty_print_nested_xml(self):
        """Test pretty printing nested XML."""
        input_data = '<root><parent><child>value</child></parent></root>'
        output = pretty_print_xml(input_data)
        self.assertIn('<root>', output)
        self.assertIn('<parent>', output)
        self.assertIn('<child>value</child>', output)
    
    def test_invalid_xml(self):
        """Test handling of invalid XML."""
        with self.assertRaises(ValueError):
            pretty_print_xml('<root><unclosed>')


class TestAutoDetectFormat(unittest.TestCase):
    """Tests for format auto-detection."""
    
    def test_detect_json_object(self):
        """Test detecting JSON object."""
        data = '{"key": "value"}'
        self.assertEqual(auto_detect_format(data), 'json')
    
    def test_detect_json_array(self):
        """Test detecting JSON array."""
        data = '[1, 2, 3]'
        self.assertEqual(auto_detect_format(data), 'json')
    
    def test_detect_xml(self):
        """Test detecting XML."""
        data = '<root><item>test</item></root>'
        self.assertEqual(auto_detect_format(data), 'xml')
    
    def test_detect_unknown(self):
        """Test handling unknown format."""
        data = 'plain text'
        self.assertIsNone(auto_detect_format(data))
    
    def test_detect_invalid_xml(self):
        """Test that invalid XML is not detected as XML."""
        data = '<root><unclosed>'
        self.assertIsNone(auto_detect_format(data))


if __name__ == '__main__':
    unittest.main()
