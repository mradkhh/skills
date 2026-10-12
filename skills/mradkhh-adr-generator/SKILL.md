---
name: mradkhh-adr-generator
description: Create Architecture Decision Records (ADRs) for architectural choices, business rules, and lasting decisions in implementation plans. Use when asked to document a decision, generate an ADR from repository changes or a plan, or record a replacement for an earlier decision. Preserve rationale, verification evidence, and decision history. Routine code edits and changelog requests alone do not trigger this skill.
---

# Architecture and Business Decision Documentation System

Record why a consequential decision was made, what was chosen, and its tradeoffs. Produce concise Markdown records grounded in supplied decisions and repository evidence. Document the actual design even when it differs from a preferred architecture; do not invent a simpler design and describe it as implemented.

Apply this workflow to any technology stack, monorepo, or business-only project. Git is needed only for Git-based requests. The skill's installation directory does not determine where records are collected.

## Establish the scope

- Resolve the project root and output catalog using the rules below. Read applicable project instructions and relevant existing ADRs. Follow the project's naming, language, and template; default to numbered Markdown files and the user's language when no convention exists.
- Use the requested plan, files, commit range, or business decision as the boundary. Do not expand an ADR request into implementation, deployment, migration, commit, or publication work.
- Prefer one record per independently understandable decision. Keep tightly coupled details together. Routine refactoring, formatting, or a commit list alone does not justify a new ADR. If no lasting decision is supported, explain that without creating a filler record.

## Resolve the project and output catalog

Determine the project root in this order:

1. Use the project explicitly identified by the user. Resolve a relative project path from the working directory. Preserve an explicitly selected subproject boundary.
2. Otherwise use the Git repository root containing the working directory (`git rev-parse --show-toplevel` when available). An internal `src/` or `apps/server/` directory is not automatically the project root.
3. Without Git, use the working directory as the project root unless the request identifies a different project folder.

If the working directory is a container for multiple projects and the request does not identify one, ask which project to document. Do not guess a sibling repository or derive the target from the installed skill path. Write into the skill repository only when that repository itself is the requested subject.

Select the ADR output directory using the first applicable source:

| Priority | Directory source |
| --- | --- |
| 1 | The user's explicit output directory for this task. |
| 2 | Applicable project documentation rules, such as AGENTS.md. |
| 3 | An existing ADR catalog appropriate to this project and decision scope. |
| 4 | `<project-root>/docs/adr/`. |

Resolve a user-supplied relative output path from the selected project root, not the shell's current subdirectory or the skill folder. Honor absolute output paths as supplied. Follow an explicitly stated path base in project instructions; otherwise resolve their relative output paths from the project root. Inspect project documentation and relevant ADR files to identify an existing catalog; ignore dependency, build, and installed-skill example directories. If several catalogs are plausible and neither scope nor instructions selects one, clarify rather than creating another catalog. A user-directed new catalog is allowed, but does not imply moving existing records.

For a monorepo, default to a single root catalog. Select a service-specific catalog only when existing project conventions or the user's request establish that scope. Do not create one catalog per package automatically. Independent projects keep independent catalogs; a shared skill installation does not create a shared document archive.

Before writing, briefly state the resolved project root, absolute output directory, and the reason it was selected. This is an informational update, not a confirmation gate. Create a missing directory only when a record is ready to be written. If the destination cannot be written, report that destination and the failure instead of silently falling back elsewhere.

## Gather evidence

Read relevant source, plans, existing records, and available verification results. Distinguish these roles:

- User decisions and approved plans establish intent and acceptance; source alone does not establish the reason a choice was made.
- Current source establishes implemented behavior within the inspected scope. Where it differs from a plan, state the discrepancy.
- Captured test results establish only what was checked against the tested revision. Test files, skipped tests, and an old successful run are not evidence that the current implementation passed.
- Business and process decisions can be documented without code. Use their supplied acceptance basis; mark missing rationale or approval as unknown rather than inventing it.

For Git-based requests, first identify the repository, HEAD, working-tree state, and requested comparison base. Inspect the actual relevant diff and files, not only commit messages or a truncated summary.

For "uncommitted and unpushed changes", inspect all four sources separately:

1. Commits in `@{upstream}..HEAD`, if the upstream resolves.
2. Staged changes (`git diff --cached`).
3. Unstaged changes (`git diff`).
4. Relevant untracked files listed by `git ls-files --others --exclude-standard`.

Record the base and HEAD identifiers, working-tree scope, and whether remote tracking information was refreshed. Local tracking refs do not prove the remote's current state. If upstream, HEAD, or Git is absent, document the available boundary and limitation; do not silently substitute a branch or fabricate an unpushed range. Ask for a base only if the requested scope cannot otherwise be determined.

Use existing verification evidence first. Run focused, permitted checks only when useful for this decision; do not require a full build or infrastructure setup merely to write documentation. Identify supplied or historical results and their revision/date where known. Never copy credentials, bearer links, or private sample data into an ADR.

## Choose status honestly

Follow an explicit project lifecycle if present. Otherwise use:

| Status | Basis |
| --- | --- |
| Proposed | The decision is a draft, acceptance is unclear, or required completion evidence is missing. |
| Accepted | The decision has an explicit acceptance basis. Claims of completed implementation also have relevant successful verification evidence. |
| Rejected | Evidence shows that this proposal was rejected. |
| Deprecated | Evidence shows that this decision was retired. |

Tests passing alone do not approve a decision. Acceptance of a business or process decision does not require a code test. Missing optional checks do not automatically block acceptance; explain their limits. If tests or rollout checks required for the claimed completion are skipped, failing, or unavailable, retain Proposed and state what remains.

Accepted does not imply deployed. Keep acceptance, implementation verification, and deployment evidence distinct. Do not silently label an unverified implementation as successfully completed, even when asked to seal it.

## Preserve history and avoid duplicates

- Read related ADRs and their replacement links before assigning a new number. Compare the requested decision with the currently applicable decision on that topic, not merely the last numbered file. If there is no substantive change and the same decision is already recorded, return its path instead of creating a duplicate.
- A related Proposed record may be refined or accepted in place when the request covers that work. Preserve its number and do not disguise new evidence as evidence available at drafting; date material updates.
- Preserve finalized records, including Accepted decisions. Document substantive corrections, retirement, or replacement in a new record that links to the earlier one and states which decision it changes. A Proposed replacement does not retire an Accepted decision.
- Under this default append-only policy, an earlier record's status remains its historical status. The later accepted replacement or retirement record establishes the change. If the project explicitly maintains old status metadata or an index, follow that convention while preserving original rationale and decision content.
- Treat immutability as a documentation convention supported by Git history, not a cryptographic or filesystem guarantee.

## Check history integrity before writing

Check numeric IDs within the selected catalog and inspect replacement relationships for the relevant topic, following links as needed. Independent catalogs may each contain ADR 001. Identify cross-catalog records by their resolved file paths, not bare numbers, and write full relative links from the new record. Treat existing explicit replacement wording as evidence too; legacy ADRs do not need to be rewritten to add a field.

- Report duplicate numeric IDs. Numbering gaps are valid.
- Every `Supersedes` target must resolve to an existing ADR. Reject self-references and circular replacement chains, including those introduced by the proposed output. Ordinary reference links are not replacement relationships.
- Check whether two Accepted decisions prescribe incompatible rules for the same scope without an explicit effective replacement. A greater number or later date does not resolve that conflict. Different scopes or explicitly non-overlapping partial replacements are not conflicts.
- A Proposed replacement expresses intent only. It leaves the existing Accepted rule in effect; it must still have valid links and no replacement cycle. Follow accepted replacements transitively and retain any parts of earlier decisions that were not replaced.
- If a defect makes the target identity or applicable decision ambiguous, report the involved files and the specific defect before writing the affected record. Request clarification only when the supplied evidence cannot resolve it. Do not silently repair finalized history, infer a winner, or label an ambiguous replacement Accepted. Unrelated documentation may proceed when its IDs and decision basis remain unambiguous.

## Write the record

Use [the ADR template](assets/adr-template.md) when the project has no template. Adapt the layout to an existing project template while retaining title, date, status, context, decision, consequences, verification evidence, and references. Verification and references may be subsections rather than new top-level headings.

- Explain the problem and why the chosen solution addresses it. Include concrete business rules, constraints, benefits, and costs. Mention alternatives only when supported by the supplied discussion or evidence.
- When an existing rule changes, include a `Change` subsection under `Decision` with `Before`, `After`, and `Reason`. Describe only the relevant change rather than restating the whole architecture. Cite the old rule's evidence; if the earlier behavior or reason is unknown, say so. Omit this subsection for a first decision with no prior rule to compare.
- When replacing a recorded decision, add a `Supersedes` metadata field with relative Markdown links to the actual prior ADRs. For a partial replacement, identify the exact rules or sections replaced and what remains in force. For a Proposed record this field denotes the intended replacement only. Omit the field when no recorded decision is replaced; do not link to the previous numeric ADR merely to form a chain. Preserve equivalent explicit fields in an existing project template.
- State gaps explicitly. Do not claim complete edge-case coverage, zero future confusion, or guaranteed success.
- Use the actual drafting date. Preserve a known historical decision date separately when documenting an older decision.
- Include code, plan, commit, and prior ADR references as applicable. Prefer repository-relative links from the output file. Keep verification brief: command or method, result, evidence source/revision when known, and relevant unchecked work. For a non-code decision, explain why code checks do not apply.
- Replace every template placeholder. Remove optional empty sections rather than inventing their content.

For a new catalog use `001-short-decision-name.md` and a matching title. Otherwise follow the existing numeric prefix width and separator. Within the selected catalog, allocate `max(existing numeric ADR prefixes) + 1`, not file count; preserve gaps and expand beyond three digits when necessary. Do not include other projects' or independent service catalogs' IDs. An existing duplicate ID within the selected catalog must be reported, not silently repaired.

Recheck the directory immediately before writing. Create new records without overwriting an existing path (use exclusive creation when supported); if another writer takes the number, reread and choose the next unused number. Do not renumber historical files.

## Verify and report

Review the actual output for:

- Correct target, unique number, matching title, real date, and justified status.
- Required content, resolved placeholders, working local references, and accurate links to previous decisions.
- An evidence-based Before/After/Reason comparison when a rule changes, and valid, acyclic replacement links when prior ADRs are superseded.
- No unresolved conflict about the applicable Accepted rule within the record's scope; Proposed replacements have not been treated as effective.
- A clear distinction between intent, implementation, verification, and deployment.
- No fabricated reasons, tests, approvals, or unrelated changes.
- No overwritten finalized ADR or unnecessary duplicate.

Inspect the final diff or newly created file, including untracked output. Return the record path, status and its basis, checks actually performed, and any material evidence gaps. If no record was created, state why and link the existing record when relevant.
