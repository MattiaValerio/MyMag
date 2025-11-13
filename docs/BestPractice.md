## 🧭 Obiettivi architetturali

Un progetto Next.js scalabile deve:

1. Separare **i domini funzionali** (es. `magazzino`, `clienti`, `promozioni`…)
2. Evitare la duplicazione di logica e UI
3. Favorire **il riuso dei componenti** e la **leggibilità**
4. Mantenere chiara la **separazione tra UI, business logic e data access**
5. Supportare **autenticazione, autorizzazione e API modulari**

---

## 📁 Struttura consigliata del progetto

Ecco una struttura tipo **feature-based**, ideale per app complesse:

```

|─ app/                      # Routing e layout Next.js (App Router)
|   ├─ (dashboard)/          # Gruppo di route protette
|   │   ├─ layout.tsx
|   │   ├─ page.tsx          # Dashboard principale
|   │   ├─ articoli/
|   │   │   ├─ page.tsx
|   │   │   ├─ new/
|   │   │   │   └─ page.tsx
|   │   │   └─ [id]/
|   │   │       └─ page.tsx
|   │   ├─ clienti/
|   │   ├─ movimenti/
|   │   ├─ promozioni/
|   │   └─ utenti/
|   └─ (auth)/               # Gruppo per login/register
|       ├─ login/
|       │   └─ page.tsx
|       └─ register/
|           └─ page.tsx
|
|─ components/               # Componenti UI riutilizzabili
|   ├─ ui/                   # Tutti i componenti shadcn/ui
|   ├─ layout/               # Navbar, Sidebar, Footer, ecc.
|   ├─ tables/               # Tabelle generiche
|   ├─ forms/                # Form reattivi (react-hook-form)
|   ├─ charts/               # Grafici (recharts)
|   └─ feedback/             # Toast, Alert, Dialog, ecc.
|
|─ features/                 # Logica per dominio/feature
|   ├─ articoli/
|   │   ├─ components/       # Componenti specifici (ArticoliTable, ArticoloForm)
|   │   ├─ hooks/            # Custom hooks (useArticoli)
|   │   ├─ services.ts       # Logica per API client-side
|   │   └─ types.ts          # Tipi TS del dominio
|   ├─ clienti/
|   ├─ movimenti/
|   ├─ promozioni/
|   └─ utenti/
|
|─ lib/                      # Moduli di utilità e business logic condivisa
|   ├─ prisma.ts             # Istanza Prisma
|   ├─ auth.ts               # Configurazione NextAuth
|   ├─ validations/          # Schemi zod
|   ├─ api/                  # Helper per chiamate API
|   └─ utils.ts              # Funzioni di utilità generiche
|
|─ db/
|   └─ schema.prisma
|
|─ styles/
|   ├─ globals.css
|   └─ theme.css
|
|─ types/
|   └─ index.d.ts            # Tipi globali
|
|─ middleware.ts             # Protezione route
|─ next.config.js
|─ package.json
|─ tsconfig.json
```

---

## 🧩 Linee guida per componenti e relazioni

### 🔸 1. **Organizza per feature, non per tipo**

Evita cartelle tipo `components/forms/` con file sparsi.
Meglio:

```
features/movimenti/components/MovimentoForm.tsx
features/movimenti/components/MovimentoTable.tsx
```

→ Ogni feature “contiene” la propria UI e logica.

---

### 🔸 2. **Layer ben distinti**

* **UI Layer** → dentro `components/` e `features/.../components/`
* **Logic Layer (hooks, services)** → dentro `features/.../hooks/` o `lib/`
* **Data Layer (Prisma, API handlers)** → dentro `app/api/...` o `lib/prisma`

---

### 🔸 3. **Utilizza layout gerarchici**

Next.js App Router supporta `layout.tsx` annidati:

```
app/(dashboard)/layout.tsx       → Sidebar + Header principali
app/(dashboard)/clienti/layout.tsx → Tab e filtri specifici clienti
```

---

### 🔸 4. **Riuso componenti shadcn/ui**

* Mantieni **componenti base** in `components/ui/`
* Crea **wrappers** per logiche comuni:

  * `DataTable` → per tutte le tabelle
  * `FormWrapper` → per validazioni `zod` + `react-hook-form`
  * `ConfirmDialog` → per conferme eliminazioni
* Evita di clonare codice UI da una pagina all’altra.

---

### 🔸 5. **Gestisci tipi e validazioni centralmente**

* Crea schemi `zod` per validazione dati:

  ```
  lib/validations/articoli.ts
  ```
* Crea interfacce TypeScript per ogni entità in:

  ```
  features/articoli/types.ts
  ```

  E importale ovunque servano.

---

### 🔸 6. **Autenticazione e ruoli**

* Usa NextAuth in `lib/auth.ts`
* Proteggi le route nel middleware:

  ```ts
  export { default } from "next-auth/middleware";
  export const config = { matcher: ["/dashboard/:path*"] };
  ```
* Nel layout, usa `useSession()` per mostrare solo ciò che l’utente può vedere.

---

### 🔸 7. **Gestione stato e comunicazione**

* Mantieni lo stato locale con **React Query / TanStack Query** o `SWR`
* Evita Redux (overkill)
* Per comunicazioni globali (es. toast o tema): Context API

---

### 🔸 8. **Naming e convenzioni**

* Componenti: PascalCase → `ArticoliTable.tsx`
* Hooks: camelCase + prefisso `use` → `useMovimenti()`
* File logica: minuscolo → `services.ts`, `utils.ts`
* Evita file enormi: preferisci file piccoli e specifici.

---

### 🔸 9. **Pulizia e consistenza**

* Un file = una responsabilità
* Commenta solo la logica non ovvia
* Usa **alias di path** in `tsconfig.json`:

  ```json
  "paths": {
    "@components/*": ["src/components/*"],
    "@features/*": ["src/features/*"],
    "@lib/*": ["src/lib/*"]
  }
  ```
* Attiva linting (`eslint-config-next`, `prettier`)

---

### 🔸 10. **Scalabilità futura**

Struttura pensata per:

* Aggiungere facilmente nuove feature (`features/fornitori/`)
* Cambiare DB o API layer senza riscrivere UI
* Personalizzare per clienti diversi (multi-tenant)

---

## ✅ In sintesi

| Aspetto        | Best practice                               |
| -------------- | ------------------------------------------- |
| Organizzazione | Per **feature/dominio**, non per tipo       |
| Componenti UI  | shadcn/ui + wrapper personalizzati          |
| Logica         | Dentro `features/.../hooks` e `lib/`        |
| Validazioni    | zod + react-hook-form                       |
| Stato          | TanStack Query / SWR                        |
| Sicurezza      | NextAuth + middleware                       |
| Scalabilità    | Layout annidati, modularità e alias di path |
| Pulizia        | ESLint + Prettier + separazione dei layer   |