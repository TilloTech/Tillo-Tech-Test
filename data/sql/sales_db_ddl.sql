-- Database creation must be performed outside a multi lined SQL file. These commands were put in this file only as a convenience.
-- 
-- object: new_database | type: DATABASE --
-- DROP DATABASE IF EXISTS new_database;
CREATE DATABASE tillo;

-- object: landing.buyers | type: TABLE --
-- DROP TABLE IF EXISTS landing.buyers CASCADE;
CREATE TABLE landing.buyers 
(
    id               INTEGER     NOT NULL,
    slug             VARCHAR(32) NOT NULL,
    name             VARCHAR(64) NOT NULL,
    float_account_id INTEGER     NOT NULL,
    tier             VARCHAR(8)  NOT NULL DEFAULT 'bronze',
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP,
    CONSTRAINT buyer_pk          PRIMARY KEY (id),
    CONSTRAINT buyer_slug_unique UNIQUE (slug)
);
COMMENT ON COLUMN landing.buyers.slug IS E'guaranteed unique, compact (under 32 characters), form of buyer''s company name in lower-case, with spaces and special characters replaced by underscores, for reference purposes.';
COMMENT ON COLUMN landing.buyers.name IS E'free-form name of buyer company, or colloquial name, for presentation purposes.';
COMMENT ON COLUMN landing.buyers.float_account_id IS E'where we keep their monies-on-account for their purchases';
COMMENT ON COLUMN landing.buyers.tier IS E'buyers subscribe at different tiers to access markerplace: bronze, silver, gold, platinum';
ALTER TABLE landing.buyers OWNER TO postgres;

-- object: landing.sellers | type: TABLE --
-- DROP TABLE IF EXISTS landing.sellers CASCADE;
CREATE TABLE landing.sellers 
(
    id           INTEGER     NOT NULL,
    slug         VARCHAR(32) NOT NULL,
    bank_account BIGINT      NOT NULL,
    name         VARCHAR(64) NOT NULL,
    created_at   TIMESTAMP   NOT NULL,
    updated_at   TIMESTAMP,
    CONSTRAINT seller_pk          PRIMARY KEY (id),
    CONSTRAINT seller_slug_unique UNIQUE (slug)
);
COMMENT ON COLUMN landing.sellers.slug IS E'guaranteed unique, compact, form of seller name in lower-case, with spaces and special characters replaced by underscores. under 32 characters.';
COMMENT ON COLUMN landing.sellers.name IS E'free-form, display version of seller company name or colloquial name.';
ALTER TABLE landing.sellers OWNER TO postgres;

-- object: landing.products | type: TABLE --
-- DROP TABLE IF EXISTS landing.products CASCADE;
CREATE TABLE landing.products
(
    id            BIGINT        NOT NULL,
    seller_id     INTEGER       NOT NULL,
    product_slug  VARCHAR(32)   NOT NULL,
    product_name  VARCHAR(64)   NOT NULL,
    currency      CHARACTER(3)  NOT NULL DEFAULT 'GBP',
    price         DECIMAL(8,2)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL,
    updated_at    TIMESTAMP,
    CONSTRAINT product_id_pk       PRIMARY KEY (id),
    CONSTRAINT product_slug_unique UNIQUE (product_slug)
);
COMMENT ON COLUMN landing.products.seller_id IS E'which seller supplies the product';
COMMENT ON COLUMN landing.products.product_slug IS E'guaranteed unique, compact (under 32 characters), form of product name in lower-case,  with spaces and special characters replaced by underscores, for reference purposes.';
COMMENT ON COLUMN landing.products.product_name IS E'display name of product';
COMMENT ON COLUMN landing.products.currency IS E'three letter iso code for the currency that the product is priced in';
COMMENT ON COLUMN landing.products.price IS E'unit price of product, in currency';
ALTER TABLE landing.products OWNER TO postgres;

-- object: product_seller_fk | type: CONSTRAINT --
-- ALTER TABLE landing.products DROP CONSTRAINT IF EXISTS product_seller_fk CASCADE;
ALTER TABLE landing.products 
    ADD CONSTRAINT product_seller_fk 
    FOREIGN KEY (seller_id)
    REFERENCES landing.sellers (id) MATCH SIMPLE
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION
;
-- ddl-end --
