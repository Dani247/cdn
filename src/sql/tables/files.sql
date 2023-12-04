-- Table: public.files

CREATE TABLE IF NOT EXISTS public.files
(
    id text COLLATE pg_catalog."default" NOT NULL,
    date timestamp without time zone NOT NULL,
    extension text COLLATE pg_catalog."default" NOT NULL,
    originalname text COLLATE pg_catalog."default" NOT NULL,
    mimetype text COLLATE pg_catalog."default"
)