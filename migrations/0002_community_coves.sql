-- Locally named coves, shared across every device. Unowned on purpose (auth off).
create table if not exists community_coves (
  id         serial primary key,
  name       text not null,
  lat        double precision not null,
  lon        double precision not null,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists community_coves_created_at_idx
  on community_coves (created_at desc);
