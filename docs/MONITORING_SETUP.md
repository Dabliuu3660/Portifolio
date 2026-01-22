# Configuração de Monitoring e Analytics

## Google Analytics 4

### Setup

1. Criar propriedade no Google Analytics
2. Obter Measurement ID (formato: G-XXXXXXXXXX)
3. Adicionar ao `.env.local`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Implementação

Adicionar ao `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Uso

```typescript
import { trackEvent, trackPageView, trackProjectView } from '@/utils/analytics';

// Track custom event
trackEvent({
  category: 'Portfolio',
  action: 'View Project',
  label: 'Project Title',
});

// Track page view
trackPageView('/portfolio', 'Portfolio Page');

// Track project view
trackProjectView('project-id', 'Project Title');
```

## Vercel Analytics

### Setup (mais simples)

1. Instalar:
```bash
npm install @vercel/analytics
```

2. Adicionar ao `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Pronto! Nenhuma configuração adicional necessária se estiver no Vercel.

## Sentry (Error Monitoring)

### Setup

1. Criar conta no Sentry (https://sentry.io)
2. Criar projeto Next.js
3. Obter DSN

4. Instalar e configurar:
```bash
npx @sentry/wizard@latest -i nextjs
```

5. Adicionar ao `.env.local`:
```env
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Uso

```typescript
import { captureException, captureMessage, setUserContext } from '@/utils/monitoring';

try {
  // código
} catch (error) {
  captureException(error as Error, {
    user: { id: 'user-123', email: 'user@example.com' },
    extra: { context: 'additional info' },
    tags: { feature: 'portfolio' },
  });
}

// Mensagens informativas
captureMessage('User completed onboarding', 'info');

// Contexto do usuário
setUserContext({
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
});
```

## Web Vitals Tracking

Já configurado no Next.js. Para ver métricas:

Criar `app/_components/web-vitals.tsx`:

```tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }
  });

  return null;
}
```

Adicionar ao layout:
```tsx
import { WebVitals } from './_components/web-vitals';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

## Lighthouse CI

Já configurado no GitHub Actions. Para rodar localmente:

```bash
npm install -g @lhci/cli
lhci autorun
```

## Dashboards Recomendados

### Google Analytics 4
- Usuários ativos
- Taxa de rejeição
- Páginas mais visitadas
- Tempo médio na página
- Conversões (contato, downloads)

### Vercel Analytics
- Pageviews
- Top páginas
- Regiões geográficas
- Performance score
- Real Experience Score

### Sentry
- Taxa de erro
- Erros mais frequentes
- Performance de transações
- Releases e deploys

## Eventos Customizados Recomendados

```typescript
// Portfolio
trackProjectView(id, title);
trackFilterUsage(category);

// Formulários
trackFormSubmission('contact', true);
trackFormSubmission('newsletter', false);

// Downloads
trackEvent({
  category: 'Download',
  action: 'Resume PDF',
  label: 'Header Button',
});

// Interações
trackInteraction('Social Link', 'Click LinkedIn');
trackInteraction('Navigation', 'Click Resume');
```

## Privacy & GDPR

Adicionar banner de cookies se necessário:

```bash
npm install react-cookie-consent
```

```tsx
import CookieConsent from 'react-cookie-consent';

<CookieConsent
  location="bottom"
  buttonText="Aceito"
  declineButtonText="Recusar"
  enableDeclineButton
  onAccept={() => {
    // Inicializar analytics
  }}
>
  Este site usa cookies para melhorar sua experiência.
</CookieConsent>
```

## Checklist

- [ ] Google Analytics configurado
- [ ] Vercel Analytics instalado
- [ ] Sentry configurado (produção)
- [ ] Web Vitals tracking
- [ ] Eventos customizados implementados
- [ ] Privacy policy atualizada
- [ ] Cookie consent (se necessário)
