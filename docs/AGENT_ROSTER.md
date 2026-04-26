# Agent Roster

AgentOS uses custom Codex agents stored in `codex-layer/agents/`. Install the layer into `.codex/` with `scripts/install-codex-layer.ps1`.

## Orchestration

### orchestrator

Routes work, decides when to parallelize, owns cross-agent coordination, and consolidates results.

Use for complex or ambiguous tasks.

### project_initiator

Turns a new app idea into a project brief, success criteria, first backlog, constraints, and recommended architecture discovery questions.

Use before a new application exists.

## Planning

### product_planner

Defines user goals, personas, journeys, scope, acceptance criteria, and release slices.

### technical_planner

Converts product scope into architecture, implementation phases, dependencies, risks, and verification strategy.

## Exploration And Design

### explorer

Reads the repository, maps evidence, and reports relevant files, commands, architecture, and risks. It does not edit files.

### architect

Defines boundaries, contracts, integration points, data flow, and tradeoffs before implementation.

## Execution

### implementer

Makes scoped code and documentation changes according to an approved plan.

### project_adapter

Adapts AgentOS into existing repositories while preserving existing conventions and behavior.

## Verification

### qa

Designs and runs test strategy, records evidence, and identifies missing coverage.

### reviewer

Reviews correctness, regressions, maintainability, and missing tests.

### security

Reviews secrets, dependency risks, auth, permissions, deployment exposure, and unsafe automation.

## Delivery

### release

Prepares changelog, versioning, PR summary, merge readiness, and release notes.

### deploy

Executes or prepares deployment with environment checks, rollback notes, and post-deploy validation.

## Operations

### observability

Defines logs, metrics, traces, alerts, dashboards, and feedback loops for shipped features.

### continuous_improvement

Turns repeated failures, review comments, and missing context into improvements to docs, scripts, agents, hooks, and rules.

### environment_curator

Maintains AgentOS itself: removes stale instructions, improves templates, refreshes agent roles, and keeps the environment coherent.
