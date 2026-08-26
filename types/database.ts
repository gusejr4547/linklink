export const LINKS_TABLE_DDL = `
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  memo TEXT,
  is_read BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_created_at ON public.links(created_at DESC);
CREATE INDEX idx_links_tags ON public.links USING GIN(tags);

-- RLS 활성화 및 본인 소유 행만 select/insert/update/delete 허용하는 정책은 Task 008에서 작성·적용한다.
`;

export const PROFILES_TABLE_DDL = `
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE FUNCTION public.handle_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_profiles_updated_at();

-- auth.users에 새 사용자가 생성될 때 profiles 행을 자동 생성한다.
-- display_name/avatar_url은 signUp() 시 options.data로 넘긴 값이 있으면 채워지고, 없으면 null로 남는다.
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SECURITY DEFINER 함수는 기본적으로 PUBLIC에 EXECUTE 권한이 부여되어
-- anon/authenticated가 PostgREST RPC(/rest/v1/rpc/handle_new_user)로 직접 호출할 수 있다.
-- 이 함수는 트리거 전용이므로(트리거 실행은 EXECUTE 권한과 무관하게 동작) 회수한다.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- RLS: LinkLink는 1인 개인용 서비스이므로 공식 예시의 anon SELECT 권한은 부여하지 않고
-- 본인 행만 select/update 가능하도록 제한한다(row 생성은 트리거가, 삭제는 auth.users의
-- ON DELETE CASCADE가 담당하므로 insert/delete 정책은 두지 않는다).
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
`;
