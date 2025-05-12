import Image from 'next/image';
import { Mentor } from '@/interfaces/homepage-course';
import { MentorSkeleton } from './HomeCourseLoading';

interface MentorListProps {
  mentors: Mentor[];
  isLoading: boolean;
}

const MentorList = ({ mentors, isLoading }: MentorListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {isLoading ? (
        <>
          {[1, 2, 3, 4].map((item, index) => (
            <MentorSkeleton key={index} />
          ))}
        </>
      ) : (
        mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="w-full h-[290px] border border-black hover:shadow-lg transition-all duration-100 group cursor-pointer"
          >
            <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center h-full">
              <div className="overflow-hidden rounded-full w-[120px] h-[120px] sm:w-[165px] sm:h-[165px]">
                <Image
                  src={mentor.avatar || '/avatar.png'}
                  alt={`${mentor.name} avatar`}
                  width={165}
                  height={165}
                  className="rounded-full object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h2 className="text-xl font-bold mt-4 transition-colors duration-100">
                {mentor.name}
              </h2>
              <p className="font-bold transition-colors duration-100">{mentor.role}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MentorList;
