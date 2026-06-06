# AGENTS.md

# Billy ERP Platform

AI Agent Operating Guide, Development Standards & Project Source of Truth

Version: 1.0

---

# 1. Project Overview

## Product Name

Billy

## Mission

Billy is a modern ERP platform designed specifically for Indian MSMEs (Micro, Small, and Medium Enterprises).

The goal is to provide a beautiful, intuitive, mobile-first business operating system that helps business owners manage:

* Sales
* Purchases
* Inventory
* Customers
* Suppliers
* Invoicing
* GST Compliance
* Payments
* Accounting
* Reporting
* Business Operations

Billy should feel premium, modern, trustworthy, and significantly easier to use than traditional ERP software.

---

# 2. Current Development Phase

## IMPORTANT

The project is currently in:

**UI/UX Design & Product Architecture Phase**

At this stage:

### Prioritize

* Screens
* Navigation
* User journeys
* Design system
* Component architecture
* Information architecture
* UX flows
* Responsive layouts
* Mock data
* Future scalability

### Do Not Prioritize

* Real backend integrations
* Production APIs
* Complex business logic
* Database implementations
* Final accounting calculations
* ERP workflow engines

When uncertain, choose the solution that improves UI architecture and future scalability.

---

# 3. Product Vision

Billy should become the operating system for Indian businesses.

The application should eventually support:

## Sales

* Quotations
* Estimates
* Invoices
* Credit Notes
* Delivery Challans

## Purchases

* Purchase Orders
* Vendor Bills
* Expense Tracking

## Inventory

* Stock Management
* Warehouses
* Batch Tracking
* Inventory Valuation

## CRM

* Customers
* Suppliers
* Contact Management

## Accounting

* Ledgers
* Journal Entries
* Receivables
* Payables
* Cashflow

## GST

* GST Invoices
* GST Reports
* E-Way Bills
* E-Invoicing
* Tax Tracking

## Analytics

* Profit & Loss
* Balance Sheet
* Cashflow
* Sales Analytics
* Business Intelligence

All design and architecture decisions should assume these modules will exist in future releases.

---

# 4. Target Users

Primary users:

* Retail Businesses
* Traders
* Wholesalers
* Distributors
* Manufacturers
* Service Businesses
* Small Accounting Teams

User characteristics:

* Mobile-first
* Time-constrained
* Not highly technical
* Need quick workflows
* Need GST compliance
* Need clear financial visibility

The UI must optimize for speed, clarity, and trust.

---

# 5. Technology Stack

## Core

* Expo SDK 56
* React Native
* TypeScript
* Expo Router
* NativeWind v5
* React Native Reanimated

## UI

* NativeWind & react-native-css
* Lucide React Native
* React Native SVG
* expo-blur & expo-glass-effect (for premium glassmorphism)

## Future State

Potential additions:

* Zustand
* TanStack Query
* MMKV
* Offline Sync Layer

Do not introduce new major dependencies without clear justification.

---

# 6. Architecture Principles

Always optimize for:

1. Simplicity
2. Scalability
3. Maintainability
4. Readability
5. Consistency

Avoid:

* Premature abstraction
* Deep inheritance
* Overengineered patterns
* Large monolithic screens

---

# 7. Routing Standards

Use Expo Router with the file-based routing logic inside `src/app/`.
- `(auth)/` for onboarding and authentication flows.
- `(app)/` for core authenticated user screens.

## Route Responsibilities

Routes should:

* Render screens
* Compose components
* Connect data

Routes should not:

* Contain reusable UI blocks
* Contain complex business logic
* Become excessively large

Maximum recommended route size:

* 300 lines preferred
* 500 lines hard limit

---

# 8. Component Architecture

## Component Extraction Rule

Create a component when:

* Reused multiple times
* Represents a business concept
* Improves screen readability

Examples:

* AuthInput
* StatCard
* DonutChart
* FloatingMenu
* OutstandingList
* InvoiceCard

Avoid creating components for trivial markup.

---

# 9. Design System

Billy should feel:

* Premium
* Modern
* Clean
* Fast
* Trustworthy

## Visual Characteristics

* Rounded corners
* Generous spacing
* Strong hierarchy
* Minimal clutter
* Smooth animations
* Business-focused aesthetics

## Design Inspiration

Blend:

* Linear
* Stripe
* Notion
* Modern fintech apps
* Premium accounting software

---

# 10. UI/UX Principles

Every screen should answer:

1. What is happening?
2. What needs attention?
3. What should the user do next?

Prioritize:

* Visual clarity
* Reduced cognitive load
* Fast data scanning
* Mobile ergonomics

---

# 11. NativeWind Standards

Use NativeWind as the primary styling system along with `global.css` for theme variables and Tailwind configuration.

Preferred:

```tsx
<View className="px-4 py-3 rounded-2xl bg-card" />
```

Avoid:

```tsx
<View style={{ padding: 16 }} />
```

Use StyleSheet only when:

* Native APIs require it
* Animated styles require it
* Platform-specific styling is necessary

---

# 12. TypeScript Standards

## Required

* Strict typing
* Explicit interfaces
* Explicit return types
* Shared domain models

## Avoid

* any
* Excessive type assertions
* Unclear unions

Example:

```ts
export interface Customer {
  id: string;
  name: string;
  gstin?: string;
  balance: number;
}
```

---

# 13. Naming Conventions

## Components

```txt
InvoiceCard.tsx
CustomerList.tsx
DashboardHeader.tsx
```

## Hooks

```txt
useCustomers.ts
useInvoiceFilters.ts
```

## Types

```ts
Customer
Invoice
Product
Supplier
```

## Constants

```ts
GST_RATES
PAYMENT_STATUS
```

---

# 14. State Management

Current phase:

* Local state first

Recommended future:

* Zustand for global state

Examples:

* User preferences
* Selected business
* Dashboard filters
* Offline cache

Do not introduce global state unnecessarily.

---

# 15. Mock Data Strategy

Until backend development begins:

Use mock data.

Store mock data in:

```txt
constants/data.ts
```

Mock data should:

* Resemble real Indian business data
* Include realistic GST values
* Include realistic invoice structures
* Support future API replacement

---

# 16. ERP Domain Modeling

Design models that mirror real business entities.

Examples:

```txt
Customer
Vendor
Invoice
PurchaseOrder
Product
Warehouse
Payment
Ledger
TaxRecord
```

Avoid creating UI-specific business models.

---

# 17. Performance Standards

Optimize for:

* Fast navigation
* Smooth scrolling
* Low re-render counts

Use:

* React.memo
* useMemo
* useCallback

Only when measurable value exists.

Do not optimize prematurely.

---

# 18. Animation Guidelines

Animations should feel:

* Subtle
* Fast
* Premium

Use Reanimated for:

* Screen transitions
* Floating actions
* Charts
* Card interactions

Avoid:

* Excessive motion
* Long durations
* Distracting effects

---

# 19. Accessibility Standards

All screens should support:

* Screen readers
* Dynamic text scaling
* Accessible touch targets

Minimum touch target:

```txt
44x44 points
```

Required:

* accessibilityLabel
* accessibilityRole
* Meaningful text hierarchy

---

# 20. Error Handling

Never silently fail.

Use:

* Empty states
* Loading states
* Error states

Every data screen should define all three.

---

# 21. Testing Expectations

Future standards:

## Unit Tests

* Utilities
* Hooks
* Domain logic

## Component Tests

* Critical UI components

## End-to-End

* Invoice creation
* Customer workflows
* Payment workflows

Do not block UI development waiting for test implementation.

---

# 22. Documentation Standards

Every major feature should include:

* Purpose
* Data flow
* Key components
* Future considerations

Complex logic must be documented.

Avoid redundant comments.

---

# 23. Git Standards

Branch naming:

```txt
feature/dashboard-redesign
feature/invoice-flow
fix/payment-summary
```

Commit format:

```txt
feat: add invoice creation screen
fix: resolve dashboard chart rendering
refactor: simplify customer card
```

---

# 24. AI Agent Rules

Before implementing anything:

1. Understand the feature request.
2. Review existing patterns.
3. Maintain consistency.
4. Avoid unnecessary dependencies.
5. Preserve architecture.
6. Respect project phase.

AI agents must prefer:

* Simple implementations
* Readable code
* Scalable structures

AI agents must avoid:

* Major architectural rewrites
* Dependency churn
* Business logic assumptions
* Premature optimization

---

# 25. Future ERP Scalability Rules

Every feature should assume:

* Multi-business support
* Multi-user support
* Offline-first capability
* Sync engine integration
* Accounting integration
* GST integration

Do not hardcode assumptions that limit future growth.

---

# 26. Dashboard Standards

Dashboard should eventually support:

* Revenue
* Expenses
* Receivables
* Payables
* GST Liability
* Cashflow
* Inventory Alerts

Design cards to be reusable.

---

# 27. Forms Standards

Forms should support future:

* Validation
* Draft saving
* Offline persistence
* API submission

Create reusable form patterns.

---

# 28. Security Guidelines

Never:

* Store secrets in frontend
* Commit credentials
* Hardcode API keys

Prepare architecture for secure backend integration later.

---

# 29. Do's

✅ Build mobile-first

✅ Use TypeScript strictly

✅ Use NativeWind consistently

✅ Use reusable design patterns

✅ Use realistic mock data

✅ Design for future ERP expansion

✅ Keep UI polished

✅ Keep architecture scalable

---

# 30. Don'ts

❌ Do not overengineer

❌ Do not create backend systems prematurely

❌ Do not introduce random libraries

❌ Do not create unnecessary abstractions

❌ Do not use any

❌ Do not duplicate UI patterns

❌ Do not mix business logic into screens

❌ Do not sacrifice UX for technical complexity

---

# 31. Success Criteria

A successful contribution should:

* Improve the user experience
* Follow existing architecture
* Remain scalable
* Be easy to understand
* Be easy for future AI agents to extend
* Move Billy closer to becoming the best ERP platform for Indian MSMEs

End of AGENTS.md