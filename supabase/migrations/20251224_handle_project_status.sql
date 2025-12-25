-- Function to handle automated project status transitions based on deadlines
create or replace function handle_project_status_transitions()
returns void
language plpgsql
security definer
as $$
begin
  -- 1. Transition from 'DangTuyen' to 'DangTienHanh'
  -- If current status is 'DangTuyen' AND recruitment deadline (thoiHanUngTuyen) has passed
  update "DuAn"
  set "trangThaiDuAn" = 'DangTienHanh'
  where "trangThaiDuAn" = 'DangTuyen'
  and "thoiHanUngTuyen" < now();

  -- 2. Transition from 'DangTienHanh' to 'ChoQuyetToan'
  -- If current status is 'DangTienHanh' AND project deadline (thoiHanDuAn) has passed
  update "DuAn"
  set "trangThaiDuAn" = 'ChoQuyetToan'
  where "trangThaiDuAn" = 'DangTienHanh'
  and "thoiHanDuAn" < now();
end;
$$;
