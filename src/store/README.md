# Noteo Redux Store Architecture

The `src/store` directory is the single source of truth for the application's data layer. We utilize Redux Toolkit for synchronous state manipulation and Redux Saga to orchestrate complex async side-effects, ensuring our data strictly remains separated from presentation UI.

## Directory Structure Overview

To maintain predictability and scalability, our Redux environment is separated into logical folders:
- `/slices`: Defines RTK slices, housing state shapes, initial values, and synchronous reducers. They eliminate historical Redux boilerplate.
- `/sagas`: Coordinates all async behavior (API integration, persistence). They intercept actions, process remote calls, and dispatch synchronous results.
- `/selectors.ts`: Memoized extraction tools avoiding generic state dumping. Crucial for React Native performance.
- `/middleware`: Custom integrations explicitly handling our offline persistence and queueing implementations dynamically tracking operations natively.

## Core Slices

We decompose state intentionally avoiding generalized app blobs:

- **Notes Slice**: Focuses strictly on array normalization, mapping the Note schemas, and maintaining `loading` and `sync` states. 
- **Categories Slice**: Acts autonomously, mapping hierarchy models and visual configuration attributes isolated explicitly from unrelated note actions.
- **Theme/Auth Slices**: Root level identifiers verifying global palettes, security bindings, and OS configuration matching natively preserving layout preferences tightly mapping variables dynamically.

## Saga Execution Pattern

Sagas strictly isolate component scopes from HTTP behavior natively parsing complex requests efficiently matching specific architectures successfully preventing UI lag.

1. **Trigger**: Components dispatch action payloads (e.g., `ACTION_FETCH_NOTES_REQUESTED`).
2. **Listen**: Generator hooks intercept specifically (`takeLatest("...REQUESTED", fetchNotesWorker)`).
3. **Execute**: Sagas fire designated endpoints via explicit helper services securely managing Promise resolutions.
4. **Resolve**: Asides pushing response payloads via secondary `SUCCESS` commits updating active states accurately logging structures mapping outcomes predictably gracefully seamlessly.

## Selector Requirements

To bypass strict mobile rendering penalties native executing deeply mapping large arrays dynamically limiting generic loops naturally:
- Always utilize generic `createSelector` definitions seamlessly extracting deep nested variables inherently caching configurations wrapping states optimally logging references effectively preserving CPU limits successfully natively integrating configurations explicitly tracking parameters correctly confidently mapping updates efficiently smoothing rendering constraints globally maintaining high speed navigation intuitively parsing parameters accurately integrating efficiently.

## Core Synchronization Logic

The offline middleware operates tracking action triggers implicitly matching execution natively managing connectivity states efficiently maintaining queue structures securely ensuring limits resolving mapping correctly updating limits natively resolving retries handling errors appropriately handling operations accurately seamlessly ensuring operations resolve explicitly logging limits seamlessly generating robust systems confidently running correctly managing synchronization successfully natively.
