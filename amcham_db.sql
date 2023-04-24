CREATE TABLE "users" (
  "user_id" integer PRIMARY KEY,
  "name" varchar(100),
  "last_name" varchar(100),
  "username" varchar(50),
  "password" varchar(15),
  "role" varchar(20),
  "token" varchar
);

CREATE TABLE "arbitration_one_referee" (
  "arbitration_id" integer PRIMARY KEY,
  "from_range" numeric(10,2) NOT NULL,
  "to_range" numeric(10,2) NOT NULL,
  "base" numeric(8,2) NOT NULL,
  "excess_percentage" numeric(2,2) NOT NULL,
  "last_updated" timestamp
);

CREATE TABLE "arbitration_three_referee" (
  "arbitration_id" integer PRIMARY KEY,
  "from_range" numeric(10,2) NOT NULL,
  "to_range" numeric(10,2) NOT NULL,
  "base" numeric(8,2) NOT NULL,
  "excess_percentage" numeric(2,2) NOT NULL,
  "last_updated" timestamp
);

CREATE TABLE "mediation" (
  "arbitration_id" integer PRIMARY KEY,
  "from_range" numeric(10,2) NOT NULL,
  "to_range" numeric(10,2) NOT NULL,
  "base" numeric(8,2) NOT NULL,
  "excess_percentage" numeric(2,2) NOT NULL,
  "last_updated" timestamp
);

CREATE TABLE "history_calcs" (
  "history_id" integer PRIMARY KEY,
  "name" varchar(200),
  "email" varchar(250),
  "company_name" varchar(100),
  "whatsapp_number" varchar(20),
  "calc_type" varchar(20),
  "consulted_amount" numeric(10,2) NOT NULL,
  "result" numeric(10,2) NOT NULL,
  "date" timestamp
);
