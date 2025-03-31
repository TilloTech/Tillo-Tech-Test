# Tillo Technical Test
## SDET Technical Test

> :warning: **PLEASE READ THIS DOCUMENT FULLY**

## Overview
We have provided a basic test automation framework using Playwright to test the Rick and Morty website and API. The application under test provides character, location, and episode information through both a web interface and REST API endpoints.

### Current Implementation

The framework currently includes:
- Basic Playwright setup
- TypeScript configuration

## Tasks

Using Playwright with TypeScript, complete the following tasks:

### 1. API Test Implementation
- Implement tests for all main API endpoints:
    > All necessary documentation can be found [here](https://rickandmortyapi.com/documentation/).

  - Characters API: `/api/character`\
    <sup>Test `filters and individual character retrieval`</sup>
  - Location API: `/api/location`\
    <sup>Test `location details and individual location retrieval`</sup>
  - Episode API: `/api/episode`\
    <sup>Test `episode information and there are at least 1 character`</sup>

### 2. E2E Test Implementation
- Create end-to-end tests for:
  - Homepage navigation and content verification
  - All menu items on the documentation page works correctly

## Evaluation Criteria
- Code organization and test structure
- Test coverage and scenario selection
- Error handling and test stability
- Use of test fixtures and code reusability

> [!NOTE]
> It shouldn't take you more than 3 hours to complete.

Have fun coding! 🚀

The Tillo Team
