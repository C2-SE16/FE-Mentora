'use client';
import ReviewService from '@/apis/reviewService';
import CommentCard from '@/components/modules/course-detail/components/CommentCard';
import { CourseReview } from '@/types/course_review';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AllReviewsComponent = () => {
  const [reviews, setReviews] = useState<CourseReview[] | null>(null);
  const [ratingCount, setRatingCount] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const courseId = '05b88570-e7e1-4b3e-8b97-15f1b4139a38';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ReviewService.getAllReviewFromCourseId(courseId);
        if (response) {
          setReviews(response.reviews);
          setRatingCount(response.ratingCount);
          console.log('✔ Reviews:', response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  const totalRatings = Object.values(ratingCount || {}).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div className="h-[700px] grid grid-cols-3 gap-1 lg:gap-6">
      <div className="col-span-3 lg:col-span-1 lg:col-start-1 ">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCount?.[rating] || 0;
          const percent = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              {/* Số sao */}
              <div className="flex items-center w-[70px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>

              {/* Thanh progress */}
              <div className="relative w-[150px] h-2 bg-gray-300 rounded overflow-hidden">
                <div
                  className="absolute h-full bg-yellow-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              {/* Phần trăm */}
              <div className="w-[40px] text-[#00FF84] font-medium">{percent}%</div>
            </div>
          );
        })}
      </div>

      <div className="col-span-3 lg:col-span-2 lg:col-start-2">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => <CommentCard key={review.reviewId} review={review} />)
        ) : (
          <p className="col-span-2 text-center pb-5">Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};
