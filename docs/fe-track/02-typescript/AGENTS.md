# 02-TYPESCRIPT KNOWLEDGE BASE

## OVERVIEW

8 files (~6k lines) covering TypeScript from basics through modern features — Phase 2, bilingual EN/VI, Junior→Senior arc.

## WHERE TO LOOK

| Topic                                                                          | File                               |
| ------------------------------------------------------------------------------ | ---------------------------------- |
| Interfaces, unions, type aliases, narrowing                                    | `01-typescript-basics.md`          |
| Utility types, mapped types, conditional types, `infer`, discriminated unions  | `02-advanced-types.md`             |
| Generic functions, constraints, defaults, inference sites                      | `03-generics-deep-dive.md`         |
| Full mock interview + combined scenarios                                       | `04-typescript-comprehensive.md`   |
| Typed props, hooks, events, component patterns in React                        | `05-react-typescript.md`           |
| Structural typing, variance, distributive conditionals, type-level programming | `05-type-inference-theory.md`      |
| `satisfies`, `const` assertions, template literals, `using` keyword            | `06-typescript-modern-features.md` |
| Phase summary, reading order, cross-links                                      | `README.md`                        |

## LOCAL CONVENTIONS

- TS version assumed: **5.x** (features like `satisfies`, `const` type params are in-scope)
- **Strict mode** throughout — `strict: true` implied in all examples
- Real-world scenarios anchor each file (ZaloPay, Grab, Axon patterns)
- Memory hooks (`🧠`) and knowledge chains precede concept deep-dives
- VI explanations via `**Tiếng Việt:**` or `🇻🇳 **Tóm tắt**:` blocks — preserve in edits

## DUPLICATE-PREFIX NOTE

Two files share the `05-` prefix intentionally:

- `05-react-typescript.md` — practical React+TS component patterns
- `05-type-inference-theory.md` — theoretical inference, variance, type algebra

They are different scopes (applied vs. theoretical). **Do not renumber either.**

## CROSS-REFERENCES

- `05-react-typescript.md` ↔ `../03-react/` — avoid duplicating hook implementation detail; TS file covers _typing_ patterns only
- `03-generics-deep-dive.md` + `05-type-inference-theory.md` ↔ `../09-advanced-topics/` — senior-level theory lives in 09; these files introduce the concepts
- `06-typescript-modern-features.md` ↔ `../15-modern-platform/` — platform-level TS (decorators, module federation types) stays in 15

## ANTI-PATTERNS

- No JS-only content (no untyped examples without explicit "before/after" framing)
- No Vue, Angular, or Svelte TS patterns — React + vanilla TS only
- Don't add framework config (tsconfig deep-dives belong in `../09-advanced-topics/`)
- Don't merge the two `05-` files or renumber them
