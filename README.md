# ClauseIQ

## AI-Powered Contract Intelligence Platform

ClauseIQ is a full-stack contract intelligence platform designed to help users upload, manage, analyze, and understand PDF contracts.

The application combines a React frontend, Node.js/Express backend, MongoDB database, and a Python/FastAPI AI microservice.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone Repository](#clone-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [AI Service Setup](#ai-service-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [AI Service API](#ai-service-api)
- [Testing](#testing)
- [Security](#security)
- [Development Workflow](#development-workflow)
- [Deployment Architecture](#deployment-architecture)
- [Current Project Status](#current-project-status)
- [Future Improvements](#future-improvements)
- [Disclaimer](#disclaimer)
- [License](#license)
- [Author](#author)

---

# Overview

Contracts contain important obligations, restrictions, deadlines, liabilities, and other legal clauses. Reading and understanding these documents manually can be time-consuming and difficult for users without legal expertise.

ClauseIQ provides a software-based workflow for processing contracts and presenting their important information in a structured form.

The platform allows users to:

- Create an account
- Authenticate securely
- Upload PDF contracts
- Manage uploaded contracts
- View contract documents
- Process contract content
- Extract text from PDF documents
- Segment contracts into clauses
- Identify potentially risky clauses
- Assign risk scores
- Generate AI-assisted summaries
- Store analysis reports
- View contract analysis through the web application

ClauseIQ is structured as multiple services so that the frontend, application backend, and AI processing layer remain independently maintainable.

---

# Features

## Authentication

- User registration
- User login
- JWT-based authentication
- Protected API endpoints
- Password hashing with bcrypt
- User-specific contract access

## Contract Management

- Upload PDF contracts
- Contract title management
- Contract metadata storage
- List user's contracts
- View individual contracts
- View uploaded PDF files
- Update contract titles
- Delete contracts
- PDF file validation

## Contract Analysis

The AI service provides the contract-processing pipeline:

```text
PDF Contract
     |
     v
PDF Text Extraction
     |
     v
Clause Segmentation
     |
     v
Risk Scoring
     |
     v
AI Summary
     |
     v
Analysis Result