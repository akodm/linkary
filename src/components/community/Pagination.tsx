'use client';

import { useLingui } from '@lingui/react';
import { usePathname } from 'next/navigation';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  Pagination as PaginationUI,
} from 'src/components/ui/pagination';

interface PaginationProps {
  total: number;
  itemsPerPage?: number;
  pagePerView?: number;
  showEllipsis?: boolean;
}

// 총 페이지 수 계산
const calcTotalPages = (total: number, itemsPerPage: number): number => {
  return Math.max(1, Math.ceil(total / itemsPerPage));
};

// 현재 페이지 파싱 (동적 경로 처리)
const parseCurrentPage = (pathname: string): number => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return 1;
  }

  // 마지막 세그먼트가 숫자인지 확인
  const lastSegment = segments[segments.length - 1];
  const parsed = Number(lastSegment);

  // 마지막 세그먼트가 유효한 페이지 번호인 경우
  if (!Number.isNaN(parsed) && parsed >= 1 && Number.isInteger(parsed)) {
    return parsed;
  }

  // 페이지 번호가 없으면 1페이지
  return 1;
};

// 기본 경로 추출 (동적 경로 처리)
const getBasePath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '';
  }

  // 마지막 세그먼트가 숫자인지 확인
  const lastSegment = segments[segments.length - 1];
  const parsed = Number(lastSegment);

  // 마지막 세그먼트가 유효한 페이지 번호인 경우, 해당 세그먼트 제외
  if (!Number.isNaN(parsed) && parsed >= 1 && Number.isInteger(parsed)) {
    return `/${segments.slice(0, -1).join('/')}`;
  }

  // 페이지 번호가 없으면 현재 경로 그대로
  return `/${segments.join('/')}`;
};

// 페이지 링크 생성 (1페이지는 community/1로 이동)
const createHref = (basePath: string, page: number): string => {
  return `${basePath}/${page}`;
};

// 페이지 그룹 값 계산
const generatePageValue = (
  count: number,
  page: number,
  pagePerView: number,
) => {
  const current = Math.floor((page - 1) / pagePerView);
  const start = current * pagePerView + 1;
  const end = Math.min(start + pagePerView - 1, count);

  return {
    current,
    start,
    end,
  };
};

// 페이지 그룹 생성
const generatePageGroup = (
  count: number,
  page: number,
  pagePerView: number,
) => {
  const { start, end } = generatePageValue(count, page, pagePerView);
  const prev = start - 1 < 1 ? 1 : start - 1;
  const next = end + 1 > count ? count : end + 1;
  const items = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return {
    prev,
    next,
    isPrev: start > 1,
    isNext: end < count,
    items,
  };
};

export default function Pagination({
  total,
  itemsPerPage = 30,
  pagePerView = 5,
  showEllipsis = true,
}: PaginationProps) {
  const { i18n } = useLingui();
  const pathname = usePathname();

  const currentPage = parseCurrentPage(pathname);
  const basePath = getBasePath(pathname);
  const totalPages = calcTotalPages(total, itemsPerPage);

  const { prev, next, isPrev, isNext, items } = generatePageGroup(
    totalPages,
    currentPage,
    pagePerView,
  );

  return (
    <PaginationUI>
      <PaginationContent>
        {/* 이전 그룹 버튼 */}
        <PaginationItem>
          {isPrev ? (
            <PaginationPrevious
              href={createHref(basePath, prev)}
              aria-disabled={false}
              tabIndex={0}
            >
              <span>{i18n.t('Previous')}</span>
            </PaginationPrevious>
          ) : (
            <PaginationPrevious
              href={createHref(basePath, 1)}
              aria-disabled={true}
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            >
              <span>{i18n.t('Previous')}</span>
            </PaginationPrevious>
          )}
        </PaginationItem>

        {/* 첫 페이지 표시 (현재 그룹에 없을 때, ellipsis 활성화 시에만) */}
        {showEllipsis && isPrev && items[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={createHref(basePath, 1)}>
                <span>1</span>
              </PaginationLink>
            </PaginationItem>
            {items[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* 페이지 번호들 */}
        {items.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createHref(basePath, page)}
              isActive={page === currentPage}
            >
              <span>{page}</span>
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 마지막 페이지 표시 (현재 그룹에 없을 때, ellipsis 활성화 시에만) */}
        {showEllipsis && isNext && items[items.length - 1] < totalPages && (
          <>
            {items[items.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={createHref(basePath, totalPages)}>
                <span>{totalPages}</span>
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* 다음 그룹 버튼 */}
        <PaginationItem>
          {isNext ? (
            <PaginationNext
              href={createHref(basePath, next)}
              aria-disabled={false}
              tabIndex={0}
            >
              <span>{i18n.t('Next')}</span>
            </PaginationNext>
          ) : (
            <PaginationNext
              href={createHref(basePath, totalPages)}
              aria-disabled={true}
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            >
              <span>{i18n.t('Next')}</span>
            </PaginationNext>
          )}
        </PaginationItem>
      </PaginationContent>
    </PaginationUI>
  );
}
