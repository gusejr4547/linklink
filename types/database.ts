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
