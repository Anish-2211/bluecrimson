# Doctor Management System Assignment for Bluecrimson
A comprehensive React + TypeScript application for managing healthcare staff registration and doctor availability scheduling.


## Setup Of The Project
First i created the app using:- npm create vite@latest



# Core Dependencies
## State Management & Forms
React Hook Form (^7.65.0) - Efficient form handling with minimal re-renders

Zod (^4.1.12) - TypeScript-first schema validation

@hookform/resolvers (^5.2.2) - Integration between React Hook Form and Zod

## Date & Time Management
date-fns (^4.1.0) - Modern date utility library for time slot management

## UI & Styling
Tailwind CSS - Utility-first CSS framework for responsive design

Lucide React (^0.546.0) - Beautiful & consistent icons

Radix UI (^1.4.3) - Unstyled, accessible UI components

clsx (^2.1.1) & tailwind-merge (^3.3.1) - Conditional CSS class management

## User Experience
Sonner (^2.0.7) - Elegant toast notifications for user feedback

## Development Utilities
Class Variance Authority (^0.7.1) - For building type-safe UI components

Tailwind Variants (^3.1.1) - Enhanced Tailwind with variant support

## Architecture Decisions
a) State Management
b) Context API: Used for global state management to avoid external dependencies

c) Local State: React useState for component-specific state

## Form Handling Strategy
a) React Hook Form for performance (minimal re-renders)

b) Zod for runtime type safety and validation

c) Custom validation resolvers for complex business rules

## Styling Approach
a) Tailwind CSS for rapid UI development

b) CSS Modules for component-scoped styles

c) Responsive design with mobile-first approach

## Project Structure Rationale

src/
├── contexts/           # Global state management
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Utilities & validators
└── types/              # TypeScript definitions
This structure promotes:

a) Separation of Concerns: Clear division between UI, logic, and state

b) Reusability: Components and hooks can be easily reused

c) Maintainability: Easy to locate and update specific functionality

d) Scalability: Can easily add new features without restructuring



# Features
## 1 User Management Module

a) User Registration: Complete registration form for healthcare staff

![alt text](<Screenshot (138).png>)


b) User Roles: Support for Admin, Front-desk, Doctor, Nurse, Lab tech, Scan tech


c) Doctor-specific Fields: Speciality, qualification, registration number, experience

![alt text](<Screenshot (139).png>)


d) User Listing: Table view with role-based filtering

![alt text](<Screenshot (140).png>)
![alt text](<Screenshot (141).png>)

  d.1) we can also search the user based on roles, username and name

  ![alt text](<Screenshot (143).png>)


e) Edit Functionality: Update user details and delete user with delete modal

![alt text](<Screenshot (146).png>)
![alt text](<Screenshot (148).png>)


f) Form Validations: Comprehensive client-side validations

## 2 Doctor Availability Module
a) Availability Scheduling: Add multiple time slots for doctors

![alt text](<Screenshot (145).png>)
![alt text](<Screenshot (144).png>)


b) Weekly Calendar: Visual weekly view of doctor availability

![alt text](<Screenshot (145)-1.png>)


c) Slot Management: we can also delete the time slots on clicking on delete icon in the time slots

![alt text](<Screenshot (147).png>)


d) Conflict Prevention: Prevents overlapping time slots

e) Intuitive UI: User-friendly scheduling interface

## Technical Stack
a) Frontend: React 18 + TypeScript

b) State Management: React Context API

c) Form Handling: React Hook Form

d) Validation: Zod schema validation

e) UI Components: Custom components with CSS modules


