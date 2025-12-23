import Header from '@/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';
import { LinkAndFolderCommunityResponse } from '@/lib/actions/link';
import Banner from '@/components/community/Banner';
import Pagination from 'src/components/community/Pagination';
import Content from 'src/components/community/Content';
import clsx from 'clsx';

interface CommunityLayoutProps {
  links: LinkAndFolderCommunityResponse['data'];
  total: number;
}

export default function CommunityLayout(props: CommunityLayoutProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center w-full relative',
        props.total === 0 ? 'h-full' : 'h-auto',
      )}
    >
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <Banner />
        <Content links={props.links} total={props.total} />
        <section className="flex md:hidden flex-row items-center mx-auto px-4 py-10">
          <Pagination
            showEllipsis={false}
            total={props.total}
            itemsPerPage={30}
            pagePerView={5}
          />
        </section>
        <section className="hidden md:flex flex-row items-center mx-auto px-4 py-10">
          <Pagination total={props.total} itemsPerPage={30} pagePerView={5} />
        </section>
      </MainProvider>
      <Footer />
    </div>
  );
}
