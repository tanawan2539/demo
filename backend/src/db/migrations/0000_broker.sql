CREATE TABLE "broker" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(250),
	"slug" VARCHAR(250) NOT NULL,
	"description" TEXT,
	"logo_url" VARCHAR(250),
	"website" VARCHAR(250),
	"broker_type" VARCHAR(250),
	"created_at" TIMESTAMP DEFAULT now(),
	"events" JSONB,
	"status_del" INTEGER DEFAULT 0
);
