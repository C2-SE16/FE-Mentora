import Banner from '@/components/Banner/Banner';
import HeaderInfo from '@/components/Header/HeaderInfo';
import BecomeTutorBanner from '@/components/Home-Courses/BecomeTutorBanner';
import HomeCourse from '@/components/Home-Courses/HomeCourse';
import TrendingNow from '@/components/Home-Courses/TrendingNow';

export default function Home() {
  return (
    <div>
      <div className="p-1">
        <div className="w-[1340px] mx-auto mt-8">
          <HeaderInfo />
        </div>
        <Banner />
        <div className="w-[1340px] mx-auto mt-8">
          <HomeCourse />
        </div>
      </div>
      <TrendingNow />
      <BecomeTutorBanner />
    </div>
  );
}
