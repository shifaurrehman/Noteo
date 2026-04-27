# Application Features & Core Domains

This document provides a highly structured overview of the overarching feature domains implemented across Noteo. 
It exists to clarify exactly how the business logic weaves through our scalable environments, explaining not just *how* things were coded structurally, but *why* specific behavior logic acts entirely in ways maximizing end-user satisfaction.

## 1. Authentication & Session Flow

The primary gateway of the application, designed flexibly ensuring frictionless native boundaries processing secure endpoints safely and providing local continuity seamlessly.

### Authentication Pathways
- **Native Login/Registration Form**: Deep component integration enforcing proper security validation layers masking inputs directly, checking structural regex requirements before broadcasting endpoints natively.
- **OAuth Providers (Future Proofing)**: Structurally, the `authSaga.ts` is generated predicting expansion implementing Google or Apple Sign In routines effortlessly handling alternate external redirect tokens.
- **Guest Mode Architecture**: An absolutely critical workflow path ensuring any individual refusing active commitments explores Noteo environments efficiently explicitly tagging records mapping local-only boundaries until explicit migrations occur globally post-signup.

### Session Persistence natively
The platform binds session identity strings deeply across system layers globally avoiding constant ping checks.
- When `LOGIN_SUCCESS` actively dispatches globally, `AsyncStorage` explicitly flags secure strings preventing login redirection screens intercepting the application dynamically following reloads.
- Active interceptors injected over HTTP `Axios` headers specifically listen monitoring backend expiry headers natively generating auto-logout workflows forcing token renewals effectively guaranteeing background environments avoid hanging natively across unauthorized backend loops.

## 2. Notes System (The Core Engine)

Noteo exists to parse, categorize, and recall information natively leveraging rapid accessibility models seamlessly prioritizing rapid throughput inherently mapping user structures strictly.

### Core Architecture
- **Note Entity Model**: A foundational structured map enforcing `id`, `title`, `content_body`, `created_date`, and generic meta strings mapping category structures intrinsically mapping relations uniformly.
- **Rich Interaction Interfaces**: Custom layouts explicitly render Markdown or generic syntax layouts smoothly scaling multi-line contexts natively tracking dynamically adjusting typing boundaries globally. 
- **The Empty-State Handler**: Specifically designed preventing ugly list drops executing gracefully mapping structural components effectively mapping "dummy note" placeholders intuitively resolving immediately following initial creations dynamically.

### Note Interaction Lifecycle globally
- Notes save across state managers intrinsically executing localized mapping routines explicitly verifying changes against previous objects inherently optimizing save dispatches efficiently.
- Deletions deploy soft-deletion flags intrinsically triggering background removal intervals specifically giving endpoints opportunities pushing final cleanup callbacks maintaining clean backend environments dynamically preserving global alignment structures.

## 3. Organizational Category Hierarchy

Categories act specifically bounding notes minimizing search latency mapping deeply categorized thought branches cleanly limiting cognitive overload inherently limiting infinite scroll burdens natively.

### Domain Responsibilities
- **Categorical CRUD Operations**: Generic implementation mapping creation logic updating color boundaries or specifically tagged icon boundaries inherently adding personalized structures limiting generic text-heavy lists natively.
- **Cross-Linking Models**: Note architectures tie tightly mapping Category UUIDs inherently. Deleting generic categorical boundaries gracefully cascades checks identifying orphaned notes properly assigning un-catagolised generic variables limiting lost tracking objects entirely.
- **Grid Layout Rendering**: Specifically designed wrapping components implementing masonry or highly unified grid models effectively scaling visual context explicitly displaying high level categorical statistics (e.g. note counts, recent updates).

## 4. Sophisticated Settings Subsystems

Settings operate controlling the granular behaviors matching Noteo environments seamlessly scaling specifically mapping user operational intentions closely controlling variables intrinsically mapped over configuration contexts dynamically.

### Theme Dynamics
- Complete detachment mapping global UI structures preventing hard-coded overrides entirely mapping explicit user options (Light, Dark, OS default) generating context wrappers updating structural models natively overriding global palettes continuously seamlessly preventing screen flashing rendering artifacts deeply.
- Avoidance of generic transparency scaling explicitly maintaining vibrant solid-color depth mapping avoiding common hazy overlay degradation specific specifically mapping dark configurations natively optimizing OLED battery efficiencies effectively.

### Preferences Configuration
- Scaling environments implicitly track local font modifications natively mapping accessibility integrations closely communicating generic OS sizing directives efficiently bypassing deep nesting limits inherently triggering immediate global resize commands optimally.
- Background control configurations natively executing synchronization constraints monitoring specifically tracking WiFi connections natively generating overrides enforcing user data saving choices efficiently strictly mapped globally preventing backend requests independently generating heavy data bills explicitly preventing friction natively.

## 5. Offline & Synchronization Behavior Model

The application resolves explicitly tracking synchronization vectors natively controlling boundaries handling operations completely offline implicitly avoiding UI loading spinners trapping users consistently executing offline.

### The Lifecycle Map 
- **Immediate Local Persistence**: Actions generating creation mapping natively into SQLite/AsyncStorage contexts entirely bypassing generic server verification limits generating immediate success states.
- **Flag Definition**: A `SYNC_STATUS` strictly tracks objects uniquely utilizing specific markers:
  - `SYNCED`: Database matches remote models natively.
  - `PENDING`: Redux persists but action never verified servers natively monitoring queue lists explicitly.
  - `FAILED`: Hard server errors generating flags signaling specific localized error states waiting user intervention directives directly enforcing structural limits effectively executing seamlessly mapping retries effortlessly.
- **Offline MiddleWare Tracking**: An internal store system actively watches explicitly tracking action dispatches pushing failure states natively wrapping actions uniquely appending specific identifiers mapping explicitly wrapping HTTP requests inside active storage lists actively tracking generic limits explicitly polling background models natively verifying connection resets explicitly pinging retries efficiently managing data integrity completely implicitly.

## 6. Real-Time Search Paradigms

- **Centralized Abstraction**: The core UI strictly shifted mapping generic inline search tracking natively mapping header endpoints invoking unified search models implementing slide-from-right animation constraints rendering heavy UI overlays effortlessly inherently isolating user focus environments elegantly managing memory deeply.
- **Fuzzy Search Indexing**: The Redux configuration seamlessly handles search requests implicitly executing local text traversals natively matching queries efficiently limiting round trips natively maximizing responsiveness mapping explicit structural requirements flawlessly executing rapidly parsing localized vectors.

## 7. Intelligent Integrations

- **Future Proof Systems**: The implementation models predict integration layers explicitly mapping hooks invoking local AI parsing requests inherently matching semantic searching or context grouping explicitly minimizing user manual data tracking effortlessly executing smart categorization independently monitoring user activity passively generating contextual understanding maps automatically dynamically handling explicit requirements seamlessly parsing logic naturally explicitly optimizing behaviors.
