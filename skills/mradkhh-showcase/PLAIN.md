# Plain language

The audience runs a business, not a codebase. Test every sentence: **would the owner understand it without asking "what does that mean?"** If not, rewrite it.

## Rules

- **People and results first.** Say who does what, what they see, and what they gain. Benefit before mechanism.
- **Short.** On screen: at most ~12 words per line item, one idea per item. Speaker notes: 1–3 short sentences.
- **Active voice, named actor.** "Tizim pulni qaytaradi", not "Pul qaytariladi".
- **One word, one meaning.** Pick one term per thing and keep it in every beat: `mijoz` *or* `xaridor`, `buyurtma` *or* `zakaz` — never both.
- **Concrete, no hype.** No "inqilobiy", "mukammal", "eng zo‘r". Show what happens instead.
- **Numbers only from the user or the code.** A limit in the code ("3 marta urinadi") is a fact; "70% tezroq" needs the user.
- **Show what the person sees.** For an error, show the message on the screen, not the reason in the code.
- **Honest limits.** Say what the change does not do. It builds trust and prevents wrong promises.
- **Uzbek orthography.** `o‘`, `g‘` with `‘`; tutuq belgisi with `’` (`ma’lumot`). `check.mjs --fix` converts ASCII `'`.

## Translate, don't transliterate

| The code says | Say instead (shape, adapt to the case) |
| --- | --- |
| API call, request, endpoint | "ilova tekshiradi", "to‘lov tizimidan javob oladi" |
| database row, table, record | "yozuv", "ro‘yxat", "hisob" |
| cache | "sahifa tezroq ochiladi" |
| queue, worker, background job | "tizim buni orqa fonda bajaradi" |
| cron, scheduler | "har kuni soat 09:00 da avtomatik" |
| webhook | "to‘lov tizimi bizga darhol xabar beradi" |
| validation | "tizim ma’lumotni tekshiradi" |
| transaction, rollback | "yoki hammasi bajariladi, yoki hech narsa o‘zgarmaydi" |
| retry | "aloqa uzilsa, tizim yana urinadi" |
| timeout | "javob kelmasa, 30 soniyadan keyin …" |
| idempotency | "tugmani ikki marta bossa ham, pul bir marta yechiladi" |
| race condition fix | "ikki kishi bir vaqtda bossa ham, xato bo‘lmaydi" |
| rate limit | "bir daqiqada 5 tadan ortiq urinishga ruxsat yo‘q" |
| role, permission | "buni faqat menejer ko‘radi" |
| feature flag | "avval bir qism mijozlar uchun yoqamiz" |
| migration | "eski ma’lumotlar yangi tartibga o‘tkaziladi" |
| deploy, release | "yangilanish ishga tushadi" |
| 4xx / 5xx error | the message the person sees: "Karta balansi yetarli emas" |
| refactor, performance work | the consequence: "sahifa tezroq ochiladi", "keyingi o‘zgarishlar tezroq qilinadi" |

## When there is nothing to show

Some changes have no visible effect (tests, refactors, upgrades). Explain them through the consequence: speed, reliability, lower cost of future work, fewer support calls. If even that is thin, tell the user the change may not need a client presentation at all.
