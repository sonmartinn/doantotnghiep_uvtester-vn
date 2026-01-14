CREATE OR REPLACE FUNCTION generate_project_initials(title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    clean_title text;
    parts text[];
    initials text := '';
    word text;
BEGIN
    -- 1. Unaccent & Uppercase
    clean_title := upper(unaccent(title));
    
    -- 2. Remove non-alphanumeric
    clean_title := regexp_replace(clean_title, '[^A-Z0-9 ]', '', 'g');
    
    -- 3. Split by whitespace
    parts := regexp_split_to_array(clean_title, '\s+');
    
    -- 4. Get first letter of each word
    FOREACH word IN ARRAY parts
    LOOP
        IF length(word) > 0 THEN
            initials := initials || substring(word, 1, 1);
        END IF;
    END LOOP;
    
    -- 5. Return only first 5 characters
    RETURN substring(initials, 1, 5);
END;
$$;
