---
title: RecursiveNamespace
date: 2023-01-01
tags: [Python, Open Source, PyPI, Developer Tools]
featured: false
links:
  code: "https://github.com/HessamLa/RecursiveNamespace"
  pypi: "https://pypi.org/project/RecursiveNamespace/"
---

## Overview

**RecursiveNamespace** is a Python package that extends the built-in `SimpleNamespace` to provide enhanced functionality for working with nested namespaces and dictionaries. It enables intuitive, Pythonic access to deeply nested data structures using dot notation.

## Problem

Python's `SimpleNamespace` is useful for creating simple objects with attribute access, but it doesn't handle nested dictionaries—you still end up with dictionary syntax for nested data. When working with configuration files, API responses, or complex data structures, this leads to awkward mixed syntax:

```python
# Annoying mixed access patterns
config.database['host']  # Why not config.database.host?
```

## Solution

RecursiveNamespace automatically converts nested dictionaries into namespace objects, allowing consistent dot-notation access at any depth:

```python
from recursivenamespace import rns

data = {
    'database': {
        'host': 'localhost',
        'port': 5432
    }
}

config = rns(data)
print(config.database.host)  # localhost
```

## Key Features

- **Recursive conversion**: Nested dictionaries become nested namespaces automatically
- **Bidirectional**: Convert back to dictionary with `.to_dict()`
- **Flexible access**: Use dot notation or bracket notation interchangeably
- **Iterable-aware**: Recognizes and preserves lists and other iterables
- **YAML-friendly**: Works seamlessly with parsed YAML configurations
- **Dictionary flattening**: Flatten nested structures with custom separators

## Example Usage

```python
from recursivenamespace import rns

# Convert nested dict to namespace
results = rns(
    params=rns(alpha=1.0, beta=2.0),
    metrics=rns(accuracy=98.79, f1=97.62)
)

# Access with dot notation
print(results.params.alpha)      # 1.0
print(results.metrics.accuracy)  # 98.79

# Convert back to dict
output = results.to_dict()

# Flatten with custom separator
flat = results.to_dict(flatten_sep='_')
# {'params_alpha': 1.0, 'params_beta': 2.0, ...}
```

## Installation

```bash
pip install RecursiveNamespace
```

## Technical Details

- Pure Python, no dependencies
- MIT License
- Available on PyPI
- Comprehensive test suite included

## Links

- [GitHub Repository](https://github.com/HessamLa/RecursiveNamespace)
- [PyPI Package](https://pypi.org/project/RecursiveNamespace/)