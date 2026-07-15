# Dolphin HR - Automatický dotazovač

Moderní frontendová aplikace postavená na Next.js (App Router), Prisma ORM a NextAuth pro správu automatizovaných dotazníkových kampaní zprostředkovávaných přes n8n.

## Technologie
- **Frontend/Backend:** Next.js 16 (App Router), React 19, Server Actions
- **Autentizace:** NextAuth.js (připraveno na Azure AD, aktuálně lokální účty)
- **Databáze:** Prisma ORM (plně připraveno na **Azure Database for PostgreSQL**)
- **UI & Design:** Čisté CSS s ostře řezaným designem (0px border-radius) a ikonami `lucide-react`

## Funkce aplikace
- **Dashboard:** Přehled běžících kampaní a stavu zaměstnanců.
- **Správa kampaní:** Vytváření nových dotazníkových kampaní a skládání otázek přes vizuální Builder (Single Choice, Multi Choice, Open-ended).
- **Analytika:** Zobrazení agregovaných výsledků a grafů pro jednotlivé kampaně.
- **Zaměstnanci:** Detailní přehled zaměstnanců a jejich stavů v rámci kampaní (pending, in_progress, completed).

---

## 🚀 Jak spustit aplikaci lokálně

### 1. Požadavky
- Node.js (v20+)
- npm

### 2. Instalace a spuštění
Otevřete terminál ve složce projektu (`frontend-app`) a spusťte:

```bash
# Instalace závislostí
npm install

# Generování Prisma klienta a testovací databáze (obsahuje testovacího admina)
npx prisma db push
npx tsx prisma/seed.ts

# Spuštění vývojářského serveru
npm run dev
```

Aplikace poběží na **http://localhost:3000** (nebo 3001, pokud je 3000 obsazen).

---

## 🔐 Přístupové údaje

Aplikace je momentálně zajištěna lokálním přihlašováním (NextAuth Credentials). Později bude nahrazeno za Azure Entra ID.

**Zkušební účet (generuje se automaticky při seedu databáze):**
- **Email:** `admin@dolphin.cz`
- **Heslo:** `admin123`

---

## 🐳 Jak spustit aplikaci v Dockeru / Azure Container Apps
Aplikace je plně kontejnerizovaná a optimalizovaná do `standalone` módu.

1. Ujistěte se, že máte v souboru `.env` nastavenou produkční URL pro vaši PostgreSQL databázi (nyní je tam testovací SQLite).
2. Spusťte přes docker-compose:
   ```bash
   docker-compose up -d --build
   ```

---

## 🗄️ Jak přepnout na produkční PostgreSQL databázi?
Aplikace je napsaná pomocí Prisma ORM, takže kód samotný na typu databáze nezávisí. Pro přechod z lokálního souboru na vaši **Azure Database for PostgreSQL** stačí:

1. V souboru `prisma/schema.prisma` změnit `provider = "sqlite"` na `provider = "postgresql"`.
2. V souboru `.env` nastavit váš připojovací řetězec:
   ```env
   DATABASE_URL="postgresql://user:password@server.postgres.database.azure.com:5432/dbname"
   ```
3. Zapsat strukturu do nové databáze a vygenerovat klienta:
   ```bash
   npx prisma db push
   ```

---

## 🤖 Integrace s n8n (Webhooks)

Tato aplikace slouží jako řídící centrum, ale samotné rozesílání zpráv (např. do MS Teams) dělá n8n.

### Odeslání odpovědí z n8n do aplikace
Jakmile n8n workflow zaznamená od zaměstnance odpovědi, zašle je zpět do této aplikace pomocí HTTP Requestu:

- **Endpoint:** `POST /api/answers`
- **Tělo (JSON):**
  ```json
  {
    "campaign_key": "KAMPAN_Q3",
    "colleague_email": "ondrej.bronec@dolphinconsulting.cz",
    "answers": {
      "1": "Velmi spokojen",
      "2": "Mám připomínky k..."
    }
  }
  ```

### Spuštění kampaně z aplikace do n8n
Při kliknutí na tlačítko "Spustit kampaň" frontend odešle POST požadavek na webhook v n8n (URL se nastavuje při tvorbě kampaně) s daty o kampani. n8n workflow tento webhook zachytí a zahájí rozesílku přes MS Teams.
