# Presales Studio v1.5 – CRM ponude i revizije
Author: DAMIR OMERASEVIC
Date: 2026-10-21

- CRM tab **Ponude i revizije** with offer records linked to RFQs.
- Numbered immutable-in-interface revision snapshots R01, R02, R03 etc., status, equipment, date, entered actor, reason, amount and terms.
- Five synthetic demo buyers and RFQs; five offer histories with 10 example revisions.
- Idempotent demo loading (avoids duplicate seed).
- CRM backup/import includes offers and revision arrays; older schema-1 JSON without `quotes` accepted.
- Previous versions v1.1/v1.2/v1.3/v1.4 unchanged in combined archive.
- localStorage demonstration only, not authenticated or tamper-proof audit.
