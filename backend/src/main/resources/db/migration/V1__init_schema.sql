--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

-- Started on 2025-07-24 13:25:08 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16452)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 258 (class 1255 OID 16566)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- TOC entry 259 (class 1255 OID 16568)
-- Name: sync_current_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_current_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE parcels
SET current_status = NEW.status,
    updated_at     = NEW.timestamp
WHERE id = NEW.parcel_id;
RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_current_status() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16489)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
                                  id uuid DEFAULT gen_random_uuid() NOT NULL,
                                  line1 text NOT NULL,
                                  line2 text,
                                  building text,
                                  apartment text,
                                  city text NOT NULL,
                                  postal_code text NOT NULL,
                                  country text DEFAULT 'Hungary'::text NOT NULL,
                                  latitude double precision,
                                  longitude double precision
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16552)
-- Name: parcel_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parcel_status_history (
                                              id bigint NOT NULL,
                                              parcel_id uuid NOT NULL,
                                              status character varying(30) NOT NULL,
                                              description text,
                                              "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.parcel_status_history OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16551)
-- Name: parcel_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parcel_status_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parcel_status_history_id_seq OWNER TO postgres;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 220
-- Name: parcel_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parcel_status_history_id_seq OWNED BY public.parcel_status_history.id;


--
-- TOC entry 218 (class 1259 OID 16515)
-- Name: parcels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parcels (
                                id uuid DEFAULT gen_random_uuid() NOT NULL,
                                sender_id uuid NOT NULL,
                                recipient_address_id uuid NOT NULL,
                                delivery_type character varying(20) NOT NULL,
                                tracking_code text NOT NULL,
                                payment_type character varying(20) NOT NULL,
                                current_status character varying(30) DEFAULT 'CREATED'::character varying NOT NULL,
                                created_at timestamp with time zone DEFAULT now() NOT NULL,
                                updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.parcels OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16538)
-- Name: predefined_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predefined_locations (
                                             id uuid DEFAULT gen_random_uuid() NOT NULL,
                                             name text NOT NULL,
                                             type character varying(20) NOT NULL,
                                             status text NOT NULL,
                                             address_id uuid
);


ALTER TABLE public.predefined_locations OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16498)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
                              id uuid DEFAULT gen_random_uuid() NOT NULL,
                              name text NOT NULL,
                              email text NOT NULL,
                              password text NOT NULL,
                              phone text,
                              address_id uuid,
                              created_at timestamp with time zone DEFAULT now() NOT NULL,
                              is_verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3348 (class 2604 OID 16555)
-- Name: parcel_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcel_status_history ALTER COLUMN id SET DEFAULT nextval('public.parcel_status_history_id_seq'::regclass);


--
-- TOC entry 3351 (class 2606 OID 16497)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 16560)
-- Name: parcel_status_history parcel_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcel_status_history
    ADD CONSTRAINT parcel_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 16525)
-- Name: parcels parcels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcels
    ADD CONSTRAINT parcels_pkey PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 16527)
-- Name: parcels parcels_tracking_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcels
    ADD CONSTRAINT parcels_tracking_code_key UNIQUE (tracking_code);


--
-- TOC entry 3361 (class 2606 OID 16545)
-- Name: predefined_locations predefined_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predefined_locations
    ADD CONSTRAINT predefined_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 16509)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3355 (class 2606 OID 16507)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3369 (class 2620 OID 16567)
-- Name: parcels trg_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 3370 (class 2620 OID 16569)
-- Name: parcel_status_history trg_sync_status; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sync_status AFTER INSERT ON public.parcel_status_history FOR EACH ROW EXECUTE FUNCTION public.sync_current_status();


--
-- TOC entry 3368 (class 2606 OID 16561)
-- Name: parcel_status_history parcel_status_history_parcel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcel_status_history
    ADD CONSTRAINT parcel_status_history_parcel_id_fkey FOREIGN KEY (parcel_id) REFERENCES public.parcels(id) ON DELETE CASCADE;


--
-- TOC entry 3365 (class 2606 OID 16533)
-- Name: parcels parcels_recipient_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcels
    ADD CONSTRAINT parcels_recipient_address_id_fkey FOREIGN KEY (recipient_address_id) REFERENCES public.addresses(id);


--
-- TOC entry 3366 (class 2606 OID 16528)
-- Name: parcels parcels_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcels
    ADD CONSTRAINT parcels_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3367 (class 2606 OID 16546)
-- Name: predefined_locations predefined_locations_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predefined_locations
    ADD CONSTRAINT predefined_locations_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- TOC entry 3364 (class 2606 OID 16510)
-- Name: users users_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


-- Completed on 2025-07-24 13:25:08 CEST

--
-- PostgreSQL database dump complete
--

