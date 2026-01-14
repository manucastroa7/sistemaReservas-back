--
-- PostgreSQL database dump
--

\restrict 1NTxoY3L4pDOocjfdLnhZ8dnszHv2fbfKMUeEDj7s10ASrzS0vnFCsbDbkFJrCx

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: expense_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.expense_category_enum AS ENUM (
    'Insumos',
    'Servicios',
    'Mantenimiento',
    'Proveedores',
    'Otros'
);


ALTER TYPE public.expense_category_enum OWNER TO postgres;

--
-- Name: reservations_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservations_status_enum AS ENUM (
    'confirmed',
    'cancelled',
    'checked-in',
    'checked-out',
    'maintenance'
);


ALTER TYPE public.reservations_status_enum OWNER TO postgres;

--
-- Name: rooms_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rooms_status_enum AS ENUM (
    'clean',
    'dirty',
    'maintenance'
);


ALTER TYPE public.rooms_status_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'superadmin',
    'admin',
    'employee',
    'admin_employee',
    'cleaning_employee',
    'maintenance_employee'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying,
    dni character varying,
    email character varying,
    phone character varying,
    "position" character varying,
    salary numeric(10,2),
    "isRegistered" boolean DEFAULT false NOT NULL,
    "paymentDay" character varying,
    "hiringDate" timestamp without time zone,
    "hotelId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    status character varying DEFAULT 'Activo'::character varying NOT NULL,
    observations text,
    "terminationDate" timestamp without time zone
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- Name: employee_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_payment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "employeeId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    date character varying NOT NULL,
    concept character varying,
    "hotelId" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.employee_payment OWNER TO postgres;

--
-- Name: expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date character varying NOT NULL,
    category public.expense_category_enum DEFAULT 'Otros'::public.expense_category_enum NOT NULL,
    description character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    supplier character varying,
    "hotelId" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.expense OWNER TO postgres;

--
-- Name: guests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "lastName" character varying NOT NULL,
    dni character varying NOT NULL,
    email character varying,
    phone character varying,
    observations text,
    "hotelId" uuid,
    country character varying,
    province character varying,
    city character varying,
    "contactSource" character varying
);


ALTER TABLE public.guests OWNER TO postgres;

--
-- Name: hotel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotel (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    address character varying,
    "contactEmail" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    location character varying,
    "rolePermissions" json DEFAULT '{"employee":["dashboard","calendar","guests","rooms","orders"],"admin":["all"]}'::json NOT NULL,
    phone character varying,
    cuit character varying,
    web character varying,
    city character varying,
    province character varying,
    country character varying
);


ALTER TABLE public.hotel OWNER TO postgres;

--
-- Name: maintenance_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    room_id integer,
    "requestDate" timestamp without time zone DEFAULT now() NOT NULL,
    "hotelId" uuid
);


ALTER TABLE public.maintenance_tasks OWNER TO postgres;

--
-- Name: reservation_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_rooms (
    reservation_id uuid NOT NULL,
    room_id integer NOT NULL
);


ALTER TABLE public.reservation_rooms OWNER TO postgres;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "checkIn" date NOT NULL,
    "lastNight" date NOT NULL,
    "checkOut" date NOT NULL,
    "pricePerNight" numeric NOT NULL,
    payments jsonb DEFAULT '[]'::jsonb NOT NULL,
    extras jsonb DEFAULT '[]'::jsonb NOT NULL,
    "isGroup" boolean DEFAULT false NOT NULL,
    "groupName" character varying,
    "commissionRecipient" character varying,
    "commissionAmount" numeric DEFAULT '0'::numeric NOT NULL,
    "commissionPaid" boolean DEFAULT false NOT NULL,
    notes text,
    status public.reservations_status_enum DEFAULT 'confirmed'::public.reservations_status_enum NOT NULL,
    guest_id uuid,
    discount numeric DEFAULT '0'::numeric NOT NULL,
    "groupId" character varying,
    pax integer DEFAULT 1 NOT NULL,
    "hotelId" uuid
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "hotelId" uuid,
    permissions jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    type character varying NOT NULL,
    capacity integer NOT NULL,
    status public.rooms_status_enum DEFAULT 'clean'::public.rooms_status_enum NOT NULL,
    "hotelId" uuid
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: salary_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "previousSalary" numeric(10,2) NOT NULL,
    "newSalary" numeric(10,2) NOT NULL,
    "changeDate" timestamp without time zone DEFAULT now() NOT NULL,
    reason character varying,
    "employeeId" uuid NOT NULL
);


ALTER TABLE public.salary_history OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_role_enum DEFAULT 'employee'::public.user_role_enum NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "hotelId" uuid,
    "roleId" character varying,
    "customRoleId" uuid,
    "position" character varying,
    salary numeric(10,2),
    "paymentDay" character varying,
    "isRegistered" boolean DEFAULT false NOT NULL,
    "hiringDate" timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (id, "firstName", "lastName", dni, email, phone, "position", salary, "isRegistered", "paymentDay", "hiringDate", "hotelId", "createdAt", "updatedAt", status, observations, "terminationDate") FROM stdin;
bb763d85-52bf-49be-8023-003dce2c04a5	Miguel	Sequeira	19381238		11838128390	Mantenimiento	500000.00	f	5	2017-01-10 00:00:00	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	2026-01-11 17:32:17.845649	2026-01-11 17:32:17.845649	Activo	\N	\N
\.


--
-- Data for Name: employee_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_payment (id, "employeeId", amount, date, concept, "hotelId", "createdAt") FROM stdin;
\.


--
-- Data for Name: expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense (id, date, category, description, amount, supplier, "hotelId", "createdAt") FROM stdin;
\.


--
-- Data for Name: guests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.guests (id, name, "lastName", dni, email, phone, observations, "hotelId", country, province, city, "contactSource") FROM stdin;
b0dd6879-0e5a-4f15-9fb3-4c521310abc9	Vivi	Turismo	VIVI	vlastagaray@gmail.com	1154088890	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
336c0a88-d62f-4707-8024-677229a88a2e	Juan Manuel	Villarino	VILLARINO	vlastagaray@gmail.com		\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
2ff296b0-443b-4a67-8a1a-242b86677d0c	Ariel	Riano	RIANO	manucastroa7@gmail.com	01137766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
3f37c9ef-4d23-42de-a524-2627f9476a51	Mariano	Giglio	GIGLIO	manucastroa7@gmail.com	1140354364	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
d05f07e4-9f8c-44a0-bd6c-6c8b0796cca5	Gonzalo	Gallardo	GALLARDO	manucastroa7@gmail.com	2244504095	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
4e72b046-2f2b-4f0f-a8c4-8588b7009197	Bahisa	Sofi	BAHISA	vlastagaray@gmail.com	1154088890	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
5e48ea05-1774-4daa-9ab7-025c351e5613	Diana	Diana	DIANA	vlastagaray@gmail.com	1154088890	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
c8a65607-acb5-41f6-8649-fbd78bc57238	Erick	Alvarez	ERICKALVAREZ	ERICKALVAREZ	2241564650	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
bac8a69d-a020-4d80-9a77-a64b54c427d8	Maia	Fussetti	MAIAFUSSETTI	MAIAFUSSETTI	2317621730	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
d15ff255-66cc-44dc-9d61-080fffd1a609	Eduardo	Guzman	GUZMANEDUARDO	GUZMANEDUARDO	GUZMANEDUARDO	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
370b288d-dbcd-4b70-b994-13fc630d8a7a	Garcia	Garcia	GARCIA	granhotelavenida@gmail.com	01137766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
ffb2b76a-e013-408b-8867-9373fd37e565	Villoria	Villoria	VILLORIA	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
415cc0bb-c225-45ef-99eb-360699e095da	Baigorri	Baigorri	BAIGORRI	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
f60586d3-f93c-4e90-9969-ce2dbddb694c	Neuquen	Neuquen	LUCAS	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
72c3fa3b-2a71-411a-bb33-c67e09a45297	Cirritio	Cirritio	ALEJANDRA	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
ea6c9ced-2abd-45cc-b97d-11c7d31a3edd	Alicia	Peralta	ALICIA	manucastroa7@gmail.com	2804638187	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
047ad5a9-4241-4441-947c-bb4e4c1c6e4b	Cardozo	Cardozo	CARDOZO	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
7730c0d6-78a1-41df-81d1-50eddf7f40bc	Colonna	Laura	COLONNA	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
14179144-f65c-46f0-be7d-7f3332a629be	Hakra	Javier	HAKRA	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
359120aa-5e80-4e44-9d38-9f6ee2daf97c	Federico	Delio	FEDERICO	manucastroa7@gmail.com	0111537766748	\N	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N
\.


--
-- Data for Name: hotel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotel (id, name, address, "contactEmail", "createdAt", location, "rolePermissions", phone, cuit, web, city, province, country) FROM stdin;
d9007971-b82e-4f7e-b5f9-0c5fb1050234	Palikao	83 329	hotelpalikao@gmail.com	2026-01-01 16:36:35.259775	Necochea	{"employee":["dashboard","calendar","guests","rooms","orders"],"admin":["all"]}	\N	\N	\N	\N	\N	\N
97ee375f-044b-4ebc-a25e-daed0fa6dd6b	Gran Hotel Avenida	Av 79 386	admin@granhotel.com	2026-01-01 16:24:39.581	\N	{"employee":["dashboard","calendar","guests","rooms","orders"],"admin":["all"],"admin_employee":["dashboard","calendar","guests"]}	\N	\N	\N	Necochea	Buenos Aires	\N
\.


--
-- Data for Name: maintenance_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_tasks (id, description, "createdAt", status, room_id, "requestDate", "hotelId") FROM stdin;
\.


--
-- Data for Name: reservation_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_rooms (reservation_id, room_id) FROM stdin;
21519e0a-7cd1-45ae-a2bb-2092ed9883b5	18
21519e0a-7cd1-45ae-a2bb-2092ed9883b5	29
3618d34b-0754-492c-a8d6-a57a5f994ceb	2
3618d34b-0754-492c-a8d6-a57a5f994ceb	19
1c5ff0e3-cd93-4f28-9d01-45a6cd33a46a	2
7370d2d6-c321-4849-a886-2393d6d0901f	29
7370d2d6-c321-4849-a886-2393d6d0901f	30
ac0dbe31-cb8d-4d8e-8141-e02d7e264fe1	30
343830f9-4759-4f5e-8a5e-f13a4012947a	26
12e68a5a-afc8-4722-91ce-1b9c34e661eb	28
5f90a64b-52d5-42b8-a454-8415b7db24ae	18
2aeac52a-f2f3-40c7-b42d-30186a3056b4	29
bc0a6871-fcf6-4dda-abd9-c40f6d85b94a	6
0834bcec-db33-49a9-b8af-9c84d22c3e5b	6
733aebd6-7fe0-4135-bb08-9f04f2a7d2b1	6
02a36420-e288-41b7-8c64-65e25f90fdf8	31
8daa59a0-d990-4118-9446-bb4c462a6ce1	27
77d858bb-4378-41e9-8316-5b4758a544e9	20
3b30a026-ecad-4813-b1fd-5c1b680e4275	22
3b30a026-ecad-4813-b1fd-5c1b680e4275	28
46033153-4895-4052-98f7-3cad9cec91b4	2
03c881be-aa50-4adb-90de-4035f33caede	9
dcaa23c7-8325-4566-b487-c211f105a172	29
291eda04-a014-4d46-a70f-7c34633dac0c	20
907e0a49-688c-4bcb-9a8f-a97019262dba	22
8bcfb71d-3cc1-4758-9fca-563b219e7202	26
4d0fcab2-074e-40a3-854b-654fb1904454	2
1bdab92d-d55f-49eb-848f-1679b98870be	9
bd9d38f3-8a5b-45b7-a07a-265d558166b9	24
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, "checkIn", "lastNight", "checkOut", "pricePerNight", payments, extras, "isGroup", "groupName", "commissionRecipient", "commissionAmount", "commissionPaid", notes, status, guest_id, discount, "groupId", pax, "hotelId") FROM stdin;
3618d34b-0754-492c-a8d6-a57a5f994ceb	2026-01-16	2026-01-24	2026-01-25	115000	[{"id": "m4vqui8wo", "date": "2025-12-30", "amount": 350000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	336c0a88-d62f-4707-8024-677229a88a2e	0	\N	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
1c5ff0e3-cd93-4f28-9d01-45a6cd33a46a	2026-02-08	2026-02-20	2026-02-21	70000	[{"id": "kbhgn2s84", "date": "2025-12-31", "amount": 455000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	2ff296b0-443b-4a67-8a1a-242b86677d0c	0	\N	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
ac0dbe31-cb8d-4d8e-8141-e02d7e264fe1	2026-01-22	2026-01-26	2026-01-27	70000	[{"id": "zcmw51mrl", "date": "2025-12-31", "amount": 175000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	d05f07e4-9f8c-44a0-bd6c-6c8b0796cca5	0	\N	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
343830f9-4759-4f5e-8a5e-f13a4012947a	2026-01-17	2026-02-17	2026-02-18	60000	[]	[]	t	SOFIA	SOFIA	0	f		confirmed	4e72b046-2f2b-4f0f-a8c4-8588b7009197	0	1767149034980-c1cvmp1tq	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
12e68a5a-afc8-4722-91ce-1b9c34e661eb	2026-01-17	2026-02-17	2026-02-18	90000	[]	[]	t	SOFIA	SOFIA	0	f		confirmed	4e72b046-2f2b-4f0f-a8c4-8588b7009197	0	1767149034980-c1cvmp1tq	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
5f90a64b-52d5-42b8-a454-8415b7db24ae	2026-01-17	2026-02-17	2026-02-18	30000	[]	[]	t	SOFIA	SOFIA	0	f		confirmed	4e72b046-2f2b-4f0f-a8c4-8588b7009197	0	1767149034980-c1cvmp1tq	1	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
2aeac52a-f2f3-40c7-b42d-30186a3056b4	2026-01-20	2026-01-24	2026-01-25	60000	[]	[]	t	SOFIA	SOFIA	0	f		confirmed	4e72b046-2f2b-4f0f-a8c4-8588b7009197	0	1767149034980-c1cvmp1tq	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
0834bcec-db33-49a9-b8af-9c84d22c3e5b	2026-02-05	2026-02-17	2026-02-18	90000	[]	[]	t	SOFIA	SOFIA	0	f		confirmed	4e72b046-2f2b-4f0f-a8c4-8588b7009197	0	1767149034980-c1cvmp1tq	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
bc0a6871-fcf6-4dda-abd9-c40f6d85b94a	2026-01-20	2026-01-24	2026-01-25	90000	[]	[]	t	SOFIA	SOFIA	0	f		confirmed	4e72b046-2f2b-4f0f-a8c4-8588b7009197	0	1767149034980-c1cvmp1tq	1	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
733aebd6-7fe0-4135-bb08-9f04f2a7d2b1	2026-01-06	2026-01-07	2026-01-08	125000	[{"id": "d5bjabg0d", "date": "2025-12-31", "amount": 125000, "method": "Transferencia", "receipt": "4587"}]	[]	f			0	f		confirmed	5e48ea05-1774-4daa-9ab7-025c351e5613	0	\N	4	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
21519e0a-7cd1-45ae-a2bb-2092ed9883b5	2026-01-03	2026-01-06	2026-01-07	120000	[]	[]	t			0	f		confirmed	b0dd6879-0e5a-4f15-9fb3-4c521310abc9	0	\N	4	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
7370d2d6-c321-4849-a886-2393d6d0901f	2026-01-10	2026-01-15	2026-01-16	130000	[{"id": "akc0rf24k", "date": "2025-12-31", "amount": 390000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	3f37c9ef-4d23-42de-a524-2627f9476a51	0	\N	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
02a36420-e288-41b7-8c64-65e25f90fdf8	2026-01-03	2026-01-06	2026-01-07	95000	[{"id": "k5uyza49m", "date": "2026-01-05", "amount": 380000, "method": "Transferencia", "receipt": "CUENTAVICKY"}]	[]	f			0	f		confirmed	c8a65607-acb5-41f6-8649-fbd78bc57238	0	\N	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
8daa59a0-d990-4118-9446-bb4c462a6ce1	2026-01-25	2026-01-28	2026-01-29	75000	[{"id": "5lo56ejik", "date": "2026-01-05", "amount": 150000, "method": "Transferencia", "receipt": "CUENTAVICKY"}]	[]	f			0	f		confirmed	bac8a69d-a020-4d80-9a77-a64b54c427d8	0	\N	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
77d858bb-4378-41e9-8316-5b4758a544e9	2026-01-04	2026-01-05	2026-01-06	90000	[{"id": "628jv4n1m", "date": "2026-01-05", "amount": 180000, "method": "Transferencia", "receipt": "CUENTAVICKY"}]	[]	f			0	f		confirmed	d15ff255-66cc-44dc-9d61-080fffd1a609	0	\N	4	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
46033153-4895-4052-98f7-3cad9cec91b4	2026-01-30	2026-02-07	2026-02-08	70000	[{"id": "4kevuhbt3", "date": "2026-01-10", "amount": 315000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	ffb2b76a-e013-408b-8867-9373fd37e565	0	\N	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
3b30a026-ecad-4813-b1fd-5c1b680e4275	2026-01-10	2026-01-10	2026-01-11	255000	[{"id": "5djai3cl4", "date": "2026-01-10", "amount": 127500, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	370b288d-dbcd-4b70-b994-13fc630d8a7a	0	\N	8	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
03c881be-aa50-4adb-90de-4035f33caede	2026-01-10	2026-01-10	2026-01-11	125000	[{"id": "iw5vjm6k1", "date": "2026-01-11", "amount": 125000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	415cc0bb-c225-45ef-99eb-360699e095da	0	\N	5	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
dcaa23c7-8325-4566-b487-c211f105a172	2026-01-09	2026-01-09	2026-01-10	65000	[{"id": "6layxrrqr", "date": "2026-01-09", "amount": 65000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	f60586d3-f93c-4e90-9969-ce2dbddb694c	0	\N	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
291eda04-a014-4d46-a70f-7c34633dac0c	2026-01-10	2026-01-10	2026-01-11	100000	[{"id": "7ui0hol2x", "date": "2026-01-10", "amount": 100000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	72c3fa3b-2a71-411a-bb33-c67e09a45297	0	\N	4	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
907e0a49-688c-4bcb-9a8f-a97019262dba	2026-01-09	2026-01-09	2026-01-10	99000	[{"id": "vebo9kur4", "date": "2026-01-09", "amount": 100000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	ea6c9ced-2abd-45cc-b97d-11c7d31a3edd	0	\N	3	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
8bcfb71d-3cc1-4758-9fca-563b219e7202	2026-01-10	2026-01-11	2026-01-12	75000	[{"id": "xa22eg4ae", "date": "2026-01-10", "amount": 75000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	047ad5a9-4241-4441-947c-bb4e4c1c6e4b	0	\N	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
4d0fcab2-074e-40a3-854b-654fb1904454	2026-01-10	2026-01-11	2026-01-12	90000	[{"id": "p25t562z8", "date": "2026-01-10", "amount": 180000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	7730c0d6-78a1-41df-81d1-50eddf7f40bc	0	\N	4	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
1bdab92d-d55f-49eb-848f-1679b98870be	2026-01-23	2026-01-24	2026-01-25	112000	[{"id": "6aiay26pt", "date": "2026-01-10", "amount": 112000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	14179144-f65c-46f0-be7d-7f3332a629be	0	\N	5	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
bd9d38f3-8a5b-45b7-a07a-265d558166b9	2026-01-10	2026-01-11	2026-01-12	75000	[{"id": "zdjl1ykc1", "date": "2026-01-10", "amount": 150000, "method": "Transferencia", "receipt": "S/N"}]	[]	f			0	f		confirmed	359120aa-5e80-4e44-9d38-9f6ee2daf97c	0	\N	2	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, "hotelId", permissions) FROM stdin;
27d41d2d-142f-42c8-9525-5c9c1a336f36	Recepcionista	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	["dashboard", "calendar", "guests"]
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, type, capacity, status, "hotelId") FROM stdin;
6	QUINTUPLE	5	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
9	QUINTUPLE	5	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
15	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
16	CUADRUPLE	4	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
18	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
19	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
20	CUADRUPLE	4	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
22	CUADRUPLE	4	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
24	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
25	TRIPLE	3	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
27	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
28	TRIPLE	3	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
29	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
30	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
31	CUADRUPLE	4	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
33	TRIPLE	3	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
10	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
17	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
23	TRIPLE	3	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
26	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
12	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
14	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
2	DOBLE	2	clean	97ee375f-044b-4ebc-a25e-daed0fa6dd6b
\.


--
-- Data for Name: salary_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_history (id, "previousSalary", "newSalary", "changeDate", reason, "employeeId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, password, role, "firstName", "lastName", "createdAt", "updatedAt", "hotelId", "roleId", "customRoleId", "position", salary, "paymentDay", "isRegistered", "hiringDate") FROM stdin;
3619dc22-38a4-443d-b590-7c147b1970e1	granhotelavenida@gmail.com	$2b$10$zSQNv1ZPy.UvlEA2SgkPEuv9Kgj3Y.OZICZnJrkfJOvjFhkrX8Xfq	admin	Admin	Hotel	2026-01-01 16:30:40.733315	2026-01-01 16:30:40.733315	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N	\N	f	\N
0bcef895-5728-4185-a1b1-d2a2a8f76294	hotelpalikao@gmail.com	$2b$10$v.DjMbRYD.rCVA709HJxOeIZCzdawkOuumOv1MpNMZOvcl0vBYA/a	admin	Admin	Palikao	2026-01-01 16:36:35.321491	2026-01-01 16:36:35.321491	d9007971-b82e-4f7e-b5f9-0c5fb1050234	\N	\N	\N	\N	\N	f	\N
f39d92c3-67d7-46e0-a516-4d6ba83c1514	manucastroa7@gmail.com	$2b$10$GEc6R8KA3nGu11nTrxCgT.LsAS7KO6Y6XKGM0aSzPl.niVKvcZy2u	superadmin	Manu	Castro	2026-01-01 13:09:08.150614	2026-01-01 13:09:08.150614	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	\N	\N	\N	\N	\N	f	\N
e428fab1-4e1d-4f11-aa98-8f11054d0a5e	agustinlastagaray@gmail.com	$2b$10$mUgp0MfXckinjoBMhIfA0.mawPc7i9OMFeo5MpugTssBgTEND.hKi	employee	Agustin	Lastagaray	2026-01-07 21:30:10.279513	2026-01-08 18:26:05.7436	97ee375f-044b-4ebc-a25e-daed0fa6dd6b	27d41d2d-142f-42c8-9525-5c9c1a336f36	\N	\N	\N	\N	f	\N
\.


--
-- Name: rooms PK_0368a2d7c215f2d0458a54933f2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY (id);


--
-- Name: reservation_rooms PK_14894df432cdda8ac44bf432a4f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_rooms
    ADD CONSTRAINT "PK_14894df432cdda8ac44bf432a4f" PRIMARY KEY (reservation_id, room_id);


--
-- Name: hotel PK_3a62ac86b369b36c1a297e9ab26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT "PK_3a62ac86b369b36c1a297e9ab26" PRIMARY KEY (id);


--
-- Name: employee PK_3c2bc72f03fd5abbbc5ac169498; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY (id);


--
-- Name: guests PK_4948267e93869ddcc6b340a2c46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT "PK_4948267e93869ddcc6b340a2c46" PRIMARY KEY (id);


--
-- Name: employee_payment PK_6c41344a20b41c8ff858e6ab0da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_payment
    ADD CONSTRAINT "PK_6c41344a20b41c8ff858e6ab0da" PRIMARY KEY (id);


--
-- Name: salary_history PK_796fc91fc02d8e1b35a08c3de32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_history
    ADD CONSTRAINT "PK_796fc91fc02d8e1b35a08c3de32" PRIMARY KEY (id);


--
-- Name: maintenance_tasks PK_a9cc63a718de2f4e13657c1942a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tasks
    ADD CONSTRAINT "PK_a9cc63a718de2f4e13657c1942a" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: reservations PK_da95cef71b617ac35dc5bcda243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY (id);


--
-- Name: expense PK_edd925b450e13ea36197c9590fc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY (id);


--
-- Name: guests UQ_0ba53efff3e03d98b0dd52a7f6d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT "UQ_0ba53efff3e03d98b0dd52a7f6d" UNIQUE (dni);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_54d066b7788c94b9487aec4c0c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_54d066b7788c94b9487aec4c0c" ON public.reservation_rooms USING btree (reservation_id);


--
-- Name: IDX_cdbbce175bcb1a04fc4e972c5b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cdbbce175bcb1a04fc4e972c5b" ON public.reservation_rooms USING btree (room_id);


--
-- Name: employee FK_34efd719677e1fbc18dce94cf7d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT "FK_34efd719677e1fbc18dce94cf7d" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- Name: reservation_rooms FK_54d066b7788c94b9487aec4c0c8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_rooms
    ADD CONSTRAINT "FK_54d066b7788c94b9487aec4c0c8" FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_payment FK_559c66e4a97d99a6ff541ac4cbf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_payment
    ADD CONSTRAINT "FK_559c66e4a97d99a6ff541ac4cbf" FOREIGN KEY ("employeeId") REFERENCES public.employee(id) ON DELETE CASCADE;


--
-- Name: guests FK_585d816a0e621c121384556dc88; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT "FK_585d816a0e621c121384556dc88" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- Name: roles FK_75effc243b6d7683c4ab45a6a5a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "FK_75effc243b6d7683c4ab45a6a5a" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- Name: reservations FK_866caf314a4659c9b0f97430953; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT "FK_866caf314a4659c9b0f97430953" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- Name: maintenance_tasks FK_948868fbcd124d04dcbf61a95b2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tasks
    ADD CONSTRAINT "FK_948868fbcd124d04dcbf61a95b2" FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: user FK_96552568a0cf816ed1290bf84a6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_96552568a0cf816ed1290bf84a6" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- Name: salary_history FK_97e8145357ebf19a056f0c2e1d1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_history
    ADD CONSTRAINT "FK_97e8145357ebf19a056f0c2e1d1" FOREIGN KEY ("employeeId") REFERENCES public.employee(id) ON DELETE CASCADE;


--
-- Name: user FK_a2fb9686009370b1735937d8b45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_a2fb9686009370b1735937d8b45" FOREIGN KEY ("customRoleId") REFERENCES public.roles(id);


--
-- Name: maintenance_tasks FK_c958fdba9c4ac6aee95e7ef2063; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tasks
    ADD CONSTRAINT "FK_c958fdba9c4ac6aee95e7ef2063" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- Name: reservation_rooms FK_cdbbce175bcb1a04fc4e972c5ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_rooms
    ADD CONSTRAINT "FK_cdbbce175bcb1a04fc4e972c5ba" FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: reservations FK_dc005326311e08f043613095b3e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT "FK_dc005326311e08f043613095b3e" FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE CASCADE;


--
-- Name: rooms FK_e9d4d68c8c47b7fe47b8e233f60; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "FK_e9d4d68c8c47b7fe47b8e233f60" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1NTxoY3L4pDOocjfdLnhZ8dnszHv2fbfKMUeEDj7s10ASrzS0vnFCsbDbkFJrCx

