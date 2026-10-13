-- Shared field pins: depth readings, water temp, hazards, and custom marks.
create table if not exists field_pins (
  id         serial primary key,
  kind       text not null check (kind in ('depth', 'temperature', 'hazard', 'pin')),
  title      text not null,
  value      text,
  lat        double precision not null,
  lon        double precision not null,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists field_pins_kind_idx on field_pins (kind);
create index if not exists field_pins_created_at_idx on field_pins (created_at desc);
