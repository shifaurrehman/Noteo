# Noteo API Services Architecture

The `src/services` directory governs all external communications in Noteo. To guarantee application robustness and scalability, no React component or Redux slice is permitted to make direct network requests. All network operations strictly route through these standardized services.

## Directory Structure

- `/api/config/`: Contains the foundational HTTP setup. This includes the base Axios instance (`api.config.ts`), default headers, timeout boundaries, and request/response interceptors.
- `/api/services/`: Specific domain abstractions (e.g., `CategoriesService.ts`, `NotesService.ts`). Each service is a collection of static methods or exported functions that map directly to exact backend endpoints. 

## Established Patterns

- **Decoupled API Client**: Rely on the configured `ApiClient` instance rather than global `fetch` or a raw Axios import. This ensures authentication tokens, base URLs, and custom logging uniquely apply universally to every request cleanly.
- **Service Segregation**: Group endpoints logically based on the specific payload resource, completely mirroring backend REST architecture implicitly ensuring code navigability seamlessly.

## Global Error Handling

Services act to normalize network and server faults into predictable responses explicitly preventing raw stack traces or unexpected status code objects from surfacing to the UI directly.

- **Structured Interception**: Global interceptors natively process standard HTTP error statuses. Any 401 Unauthorized securely triggers background token refresh cycles or global log-out dispatches respectively.
- **Catch Mapping**: Individual service methods handle local exceptions cleanly utilizing generic translation layers ensuring reducers consume explicitly typed error interfaces maintaining UI integrity seamlessly flawlessly operating across contexts dependably managing limits structurally tracking smoothly.

## Strict Contract Typing

To mitigate integration risks, every service exclusively defines parameters explicitly and forces typescript inferences checking JSON bodies dependably limiting miscommunications dynamically defining structure dependably successfully modeling generic interfaces flawlessly capturing expectations strictly checking validations successfully wrapping outcomes mapping intuitively.
