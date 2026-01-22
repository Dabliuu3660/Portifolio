# ✅ Migração Completa para Supabase

O projeto foi totalmente adaptado para funcionar com **Supabase** de forma nativa.

## O Que Foi Feito

### 1. Autenticação (Auth)
- **Híbrido**: O sistema detecta automaticamente se deve usar Auth Local ou Supabase Auth.
- **Hook**: `useAuth` atualizado para gerenciar sessões reais do Supabase.
- **Segurança**: Login real com JWT e persistência de sessão.

### 2. Banco de Dados (Database)
- **Repositórios**: Implementados `SupabaseProjectRepository` e `SupabaseMessageRepository`.
- **Factory Automática**: O sistema troca de `IndexedDB` para `Postgres` apenas adicionando as variáveis de ambiente.
- **Consistência**: Validação Zod mantida em todos os níveis.

### 3. Arquivos (Storage)
- **Upload Direto**: Imagens e vídeos vão direto para os buckets `portfolio-images` e `portfolio-videos`.
- **Organização**: Arquivos salvos em pastas `projects/{id}/` garantindo organização.
- **Performance**: URLs públicas servidas via CDN global.
- **UX**: Barra de progresso implementada nos uploads.

---

## 🚀 Como Ativar Agora

O código já está pronto. Para ativar, siga estes 3 passos:

### Passo 1: Configurar Variáveis
Adicione ao seu `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Passo 2: Executar SQL no Supabase
Vá no SQL Editor do seu dashboard Supabase e execute:

```sql
-- TABELAS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  media_type TEXT NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-videos', 'portfolio-videos', true);

-- POLICIES (Segurança básica para começar)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth Write" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Policies
CREATE POLICY "Public Read Images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Auth Upload Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
```

### Passo 3: Criar Usuário
No painel do Supabase > Authentication > Users > Add User.
Use este email/senha para logar no `/admin`.

---

**Status**: 🟢 **PRONTO PARA DEPLOY**
Assim que as variáveis forem inseridas, o site "vira a chave" automaticamente. Sem as variáveis, ele continua funcionando 100% offline com IndexedDB.
