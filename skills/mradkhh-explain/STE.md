# STE rung — ASD-STE100 Simplified Technical English

ASD-STE100 is a controlled language from aerospace maintenance manuals. Its constraints force clean, unambiguous writing. Use it for every word an explanation contains, on every rung.

## Strictness

Default to **80% STE**: follow the rules below, but keep project terms, code identifiers, and a natural rhythm. Use **full STE** only when the user asks for it ("strict STE", "full STE100").

## Rules

- **One word, one meaning.** Pick one term for each concept and keep it everywhere. Use the project's own names for code things (`settleCommission`, `wallet`), unchanged and in code font.
- **Short sentences.** Procedural text: at most 20 words. Descriptive text: at most 25 words.
- **One instruction or one idea per sentence.**
- **Active voice.** Name who does the action: "The service writes the row", not "The row is written".
- **Simple tenses**: present, simple past, simple future.
- **Paragraphs** of at most 6 sentences, each about one topic.
- **Steps as numbered lists**, one action per step, the condition first: "If the balance is low, the service stops the payment."
- **Lists for parallel items**, not long comma chains.
- **Concrete words**: "the API returns 409" over "an error may occur".
- **Notes and warnings** go before the step they apply to, marked **Note:** or **Warning:**.

## Language

Write in the user's language. When it is not English, apply the same rules to that language and keep technical terms in their original form.

## Shape of an STE explanation

1. **What it is** — one sentence.
2. **Why it exists** — one or two sentences.
3. **How it works** — numbered steps, each grounded with `file:line`.
4. **Edge cases** — a short list: condition → result.
