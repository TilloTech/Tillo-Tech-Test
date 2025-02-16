# Tillo Technical Test
## .Net Engineer - VB.Net

> :warning: **PLEASE READ THIS DOCUMENT FULLY**

## Overview
We have provided a basic application that displays and manages simulated transactional data from a local SQLite database. The application is built using ASP.NET Web Forms with VB.NET.

### Current Implementation

The application currently includes:
- A transaction history page
- Integration with a local SQLite database
- A button to refresh the table from an SQLite database
- A button to simulate a transation (deposit, withdrawal, transfer)
- Basic transaction data model
- Simple error handling

![](assets/topup.png)  |  ![](assets/transfer.png) |  ![](assets/withdraw.png)
:-------------------------:|:-------------------------:|:-------------------------:
*TopUp Similation*         |   *Transfer Similation*   |  *Withdraw Similation*

## Tasks

Using ASP.NET Web Forms with VB.NET, complete the following tasks.

### 1. Code Refactoring and Architecture Improvements
- Consider implementing appropriate design principles and patterns
- Look for opportunities to improve code organization and structure
- Evaluate and enhance error handling approaches
- Implementing testing

### 2. Transaction Simulation Features
- Implement 3 transaction types:
  - Deposit: Add funds to account balance
  - Withdrawal: Remove funds from account balance 
  - Transfer: Move funds between accounts (no need to verify amount reached another account)
- Each transaction should:
  - Generate a unique transaction ID
  - Record timestamp
  - Include amount, description, type and status
  - Update account balance(s) accordingly
- Validate:
  - Sufficient funds for withdrawals/transfers
  - Valid amount (positive, within limits)
  - Required fields are provided

### 3. Transaction History Table Enhancements
- Add column sorting (ascending/descending) for all columns
- Add filters for:
    - Date range
    - Transaction type
    - Amount range
    - Status
- Allow multiple filters to be applied simultaneously (Bonus)
- Update results dynamically as filters change 

### 4. Pagination
- Add features:
  - Configurable page size
  - Navigation controls
  - Page indicators
  - Total count
- Maintain pagination state during:
  - Sorting
  - Filtering
  - Data refresh
- Optimize for performance with large datasets

### 5. Implement RESTful APIs (Bonus)
- No need for authentication and authorization
- Refactor your code to use these APIs
- Create API endpoints for:
  - Retrieving transaction history with filtering and pagination
  - Creating new transactions (deposit/withdrawal/transfer)
  - Getting account balances and transaction details
- Implement proper API versioning
- Add API documentation using Swagger/OpenAPI

## Evaluation Criteria
- Code quality and organization
- Security considerations
- Performance optimization approaches
- Understanding of financial transaction requirements
- Testing methodology
- Architectural decisions
- Problem-solving approach

## Submission Guidelines
1. Fork this repository
2. Implement your improvements
3. Document your changes and reasoning
4. Submit a pull request with your changes

Have fun coding! 🚀

The Tillo Team
