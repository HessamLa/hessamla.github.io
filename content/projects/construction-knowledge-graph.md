---
title: LLM-Powered Construction Knowledge Graphs
date: 2024-09-01
tags: [LLM, Knowledge Graphs, NLP, Inertia Systems]
featured: true
links:
  code: "#"
---

## Overview

At Inertia Systems, I developed an LLM-powered pipeline for automatically constructing knowledge graphs from construction documents, enabling automated conflict detection across project specifications.

## Problem

Construction projects involve thousands of documents—specs, drawings, contracts, change orders. Conflicts between documents (contradictory requirements, scheduling issues, specification mismatches) cause costly delays. Manual review doesn't scale.

## Approach

I built an end-to-end system combining:

- **LLM-based entity extraction** from unstructured construction documents
- **Relation identification** using fine-tuned models for construction domain
- **Knowledge graph construction** with domain-specific schema
- **Conflict detection algorithms** operating on the graph structure

## Key Innovations

- **Domain adaptation**: Tailored extraction prompts for construction terminology
- **Hierarchical document parsing**: Handling nested specifications and references
- **Confidence-weighted edges**: Distinguishing certain vs. inferred relationships

## Results

The system successfully identifies conflicts that would require hours of manual review, including:

- Specification contradictions across documents
- Scheduling impossibilities
- Material/method incompatibilities

## Technical Stack

LLMs (GPT-4, Claude), Python, Knowledge Graphs, NLP pipelines
