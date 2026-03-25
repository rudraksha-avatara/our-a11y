# Security Model

## Trust boundaries

OurA11y is a third-party script that executes in the host page context. That means:

- The host site must trust the script origin
- The script must minimize DOM mutation and avoid unsafe code paths
- Hosted configuration services must be treated as untrusted input sources until validated

## Core controls

- No `eval` or dynamic code execution
- No remote HTML injection into the widget UI
- DOM APIs are used for rendering instead of string-based HTML where untrusted data is involved
- Client-side allowlists are advisory, not authoritative

## Operational guidance

- Serve immutable versioned bundles
- Use Subresource Integrity where possible for fixed asset URLs
- Keep deployment keys and publishing credentials outside the repository
- Review changes to remediation heuristics carefully because they affect third-party host pages
