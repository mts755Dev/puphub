\echo 'Delete and recreate puphub db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE puphub;
CREATE DATABASE puphub;
\connect puphub

\i puphub-schema.sql
\i puphub-seed.sql

-- \echo 'Delete and recreate jobly_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE jobly_test;
-- CREATE DATABASE jobly_test;
-- \connect jobly_test

-- \i jobly-schema.sql
