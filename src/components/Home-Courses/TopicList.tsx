import Button from '../Button/Button';
import { TopicSkeleton } from './HomeCourseLoading';

interface TopicListProps {
  topics: string[];
  isLoading: boolean;
}

const TopicList = ({ topics, isLoading }: TopicListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {isLoading
        ? Array(8)
            .fill(0)
            .map((_, index) => <TopicSkeleton key={index} />)
        : topics.map((topic, index) => (
            <div key={index}>
              <Button
                href="/courses/1"
                minWidth={310}
                backgroundColor="#fff"
                textColor="black"
                textSize='16'
                className="w-full border border-black shadow-custom transition-all duration-300 hover:bg-[#171100] hover:text-white hover:border-[#3A10E5] hover:shadow-lg"
              >
                {topic}
              </Button>
            </div>
          ))}
    </div>
  );
};

export default TopicList;
