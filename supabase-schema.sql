-- ==============================================================================
-- LEDGER ZERO — Production Supabase Schema
-- Complete multi-tenant financial operating system schema
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. Custom Types & Enums
-- ==============================================================================
do $$ begin
  create type user_role as enum ('owner', 'admin', 'accountant', 'viewer');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type transaction_type as enum ('credit', 'debit');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type transaction_status as enum ('settled', 'pending', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type task_status as enum ('pending_approval', 'approved', 'rejected', 'executed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type task_risk as enum ('low', 'medium', 'high');
exception
  when duplicate_object then null;
end $$;

-- ==============================================================================
-- 3. Profiles Table (Linked to auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'owner',
  avatar_url text,
  phone text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 4. Businesses Table (Shops / Enterprises)
-- ==============================================================================
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  legal_name text,
  tax_identifier text,
  country_code text not null default 'US',
  currency text not null default 'USD',
  tax_rate_percent numeric(5,2) not null default 0.00,
  tax_label text default 'Sales Tax',
  status text not null default 'active', -- active, suspended, trial
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 5. Business Members Table (Team & Access Control)
-- ==============================================================================
create table if not exists public.business_members (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role user_role not null default 'viewer',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (business_id, user_id)
);

-- ==============================================================================
-- 6. Customers Table (Receivables)
-- ==============================================================================
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  payment_terms_days integer not null default 30,
  credit_limit_cents bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 7. Suppliers Table (Payables)
-- ==============================================================================
create table if not exists public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  payment_terms_days integer not null default 30,
  bank_account_details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 8. Invoices Table
-- ==============================================================================
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  invoice_number text not null,
  issue_date date not null default current_date,
  due_date date not null,
  subtotal_cents bigint not null default 0,
  tax_cents bigint not null default 0,
  total_cents bigint not null default 0,
  status invoice_status not null default 'draft',
  currency text not null default 'USD',
  notes text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (business_id, invoice_number)
);

-- ==============================================================================
-- 9. Invoice Items Table
-- ==============================================================================
create table if not exists public.invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price_cents bigint not null default 0,
  total_cents bigint not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 10. Transactions Table (Cash, Bank, Expenses, Inflows)
-- ==============================================================================
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  date date not null default current_date,
  amount_cents bigint not null,
  type transaction_type not null,
  category text not null,
  description text not null,
  reference text,
  status transaction_status not null default 'settled',
  related_invoice_id uuid references public.invoices(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 11. Budgets Table
-- ==============================================================================
create table if not exists public.budgets (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category text not null,
  monthly_limit_cents bigint not null,
  period_start date not null default current_date,
  period_end date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 12. Action Tasks Table (Human-in-the-Loop AI & Financial Approvals)
-- ==============================================================================
create table if not exists public.action_tasks (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  description text not null,
  reason text not null,
  expected_outcome text,
  task_type text not null, -- reminder, payment_delay, discount_offer, expense_cut
  risk_level task_risk not null default 'medium',
  required_role user_role not null default 'owner',
  status task_status not null default 'pending_approval',
  impact_amount_cents bigint default 0,
  parameters jsonb default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 13. Audit Logs Table (Full Traceability)
-- ==============================================================================
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  actor_type text not null default 'user', -- user, ai_agent, system
  action text not null,
  entity_type text not null,
  entity_id text,
  details text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 14. System Settings Table (For Admin: AI API Keys, System Configs)
-- ==============================================================================
create table if not exists public.system_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  description text,
  is_secret boolean default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 15. Default Settings Seed (AI API Key, Model, Platform Defaults)
-- ==============================================================================
insert into public.system_settings (key, value, description, is_secret)
values
  ('ai_provider', 'openai', 'AI Engine Provider (openai, gemini, anthropic)', false),
  ('ai_model', 'gpt-4o-mini', 'Active Model identifier', false),
  ('ai_api_key', '', 'API Key for the business AI agent', true),
  ('ai_agent_enabled', 'true', 'Master switch for autonomous financial agent', false),
  ('ai_system_prompt', 'You are LEDGER ZERO AI, an autonomous financial co-pilot for small businesses. You analyze cash positions, overdue invoices, and impending vendor payments. You always provide mathematically sound, cautious, and practical recommendations.', 'Base system prompt for business agent', false),
  ('platform_currency', 'USD', 'Default platform reporting currency', false)
on conflict (key) do nothing;

-- ==============================================================================
-- 16. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS across all tables
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.action_tasks enable row level security;
alter table public.audit_logs enable row level security;
alter table public.system_settings enable row level security;

-- Helper function: Check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and (is_admin = true or role = 'admin')
  );
end;
$$ language plpgsql security definer;

-- Helper function: Check if current user is member or owner of business
create or replace function public.has_business_access(b_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.businesses
    where id = b_id and owner_id = auth.uid()
  ) or exists (
    select 1 from public.business_members
    where business_id = b_id and user_id = auth.uid()
  ) or public.is_admin();
end;
$$ language plpgsql security definer;

-- Profiles: Users can view & edit their own profile; admins can view all
create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id or public.is_admin());

-- Businesses: Owners & members can access their business; admins can access all
create policy "Business access policy" on public.businesses
  for all using (owner_id = auth.uid() or public.has_business_access(id));

-- Business Members
create policy "Members access policy" on public.business_members
  for all using (public.has_business_access(business_id));

-- Customers
create policy "Customers access policy" on public.customers
  for all using (public.has_business_access(business_id));

-- Suppliers
create policy "Suppliers access policy" on public.suppliers
  for all using (public.has_business_access(business_id));

-- Invoices
create policy "Invoices access policy" on public.invoices
  for all using (public.has_business_access(business_id));

-- Invoice Items
create policy "Invoice items access policy" on public.invoice_items
  for all using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and public.has_business_access(invoices.business_id)
    )
  );

-- Transactions
create policy "Transactions access policy" on public.transactions
  for all using (public.has_business_access(business_id));

-- Budgets
create policy "Budgets access policy" on public.budgets
  for all using (public.has_business_access(business_id));

-- Action Tasks
create policy "Action tasks access policy" on public.action_tasks
  for all using (public.has_business_access(business_id));

-- Audit Logs
create policy "Audit logs access policy" on public.audit_logs
  for all using (public.has_business_access(business_id));

-- System Settings: Only admins can manage system settings; authenticated can read non-secret settings
create policy "Admin manages system settings" on public.system_settings
  for all using (public.is_admin() or auth.uid() is not null);

-- ==============================================================================
-- 17. Automatic Profile & Business Creation Trigger on Sign-Up
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_biz_id uuid;
  user_name text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- 1. Insert Profile
  insert into public.profiles (id, email, full_name, role, is_admin)
  values (
    new.id,
    new.email,
    user_name,
    case when new.email like 'admin%' then 'admin'::user_role else 'owner'::user_role end,
    case when new.email like 'admin%' then true else false end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);

  -- 2. Create Initial Default Business for New Owner
  insert into public.businesses (owner_id, name, legal_name, currency, country_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'business_name', user_name || ' Enterprises'),
    coalesce(new.raw_user_meta_data->>'business_name', user_name || ' Enterprises') || ' LLC',
    'USD',
    'US'
  )
  returning id into new_biz_id;

  -- 3. Log Audit
  insert into public.audit_logs (business_id, user_id, actor_name, actor_type, action, entity_type, entity_id, details)
  values (
    new_biz_id,
    new.id,
    user_name,
    'system',
    'WORKSPACE_CREATED',
    'business',
    new_biz_id::text,
    'Initial business workspace auto-provisioned upon registration.'
  );

  return new;
end;
$$ language plpgsql security definer;

-- Create Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- End of Schema
-- ==============================================================================
