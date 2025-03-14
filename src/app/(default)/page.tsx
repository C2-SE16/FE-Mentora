import Banner from '@/components/Banner/Banner';
import BecomeTutorBanner from '@/components/Home-Courses/BecomeTutorBanner';
import HomeCourse from '@/components/Home-Courses/HomeCourse';

export default function Home() {
  return (
    <div>
      <div className="p-8">
        <Banner />
        <div className="w-[1340px] mx-auto mt-8">
          <h1 className="text-3xl font-bold">Nên học cái gì tiếp theo</h1>
          <h2 className="text-2xl mt-2 font-medium">Đề xuất cho bạn</h2>
          <HomeCourse />
        </div>
      </div>
      <BecomeTutorBanner />
    </div>
  );
}
