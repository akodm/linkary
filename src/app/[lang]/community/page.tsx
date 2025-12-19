import CommunityLayout from '@/components/community/Layout';
import { getLinksCommunity } from '@/lib/actions/link';

// SSG + ISR: 빌드 타임에 정적 생성, 1시간마다 재검증
export const revalidate = 3600; // 1시간 (3600초)

export default async function CommunityPage() {
  const { data, total } = await getLinksCommunity({ page: 1, size: 30 });

  return <CommunityLayout links={data} total={total} />;
}
