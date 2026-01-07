-- Create a function to count 'DaDuyet' applications for a project
-- distinct from the RLS-restricted direct count.
-- This function takes a DuAn row as input, allowing it to be used as a computed column.

CREATE OR REPLACE FUNCTION so_luong_da_duyet(du_an_row "DuAn")
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER -- Runs with privileges of the creator (likely postgres/admin)
STABLE           -- Deterministic within a transaction (good for performance)
AS $$
  SELECT count(*)
  FROM "UngTuyen"
  WHERE "maDuAn" = du_an_row."maDuAn"
  AND "trangThaiUngTuyen" = 'DaDuyet';
$$;
