import ReviewService from '@/apis/reviewService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CourseReview } from '@/types/course_review';
import { Course } from '@/types/courses';
import { Star } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { decodeJWT } from '@/utils/jwt';
import router from 'next/router';
interface CommentInputProps {
  courseId: string;
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

const CommentInput: React.FC<CommentInputProps> = ({ courseId, setCourse }) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');

  const handleCreateReview = async () => {
    if (!comment.trim() || stars === 0) {
      toast.error('Hãy nhập bình luận và đánh giá sao!');
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để bình luận');
      router.push('/login');
      return;
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid token');
    }

    const newReview: Partial<CourseReview> = {
      reviewId: crypto.randomUUID(), // Tạo ID ngẫu nhiên (tránh trùng lặp)
      courseId: courseId,
      userId: decodedToken.sub,
      rating: stars,
      comment: comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ReviewService.createReview(newReview);
    if (result) {
      console.log('Review created successfully:', result);

      setCourse((prevCourse) => {
        if (!prevCourse) return prevCourse;
        return {
          ...prevCourse,
          reviews: [result, ...(prevCourse.reviews || [])],
        };
      });

      setStars(0);
      setComment('');
    } else {
      console.error('Failed to create review');
    }
  };

  return (
    <div className="col-span-2 p-5 border border-black rounded-sm">
      <Textarea
        placeholder="Type your message here."
        className="border border-black"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex flex-row justify-between pt-4">
        <div className="grid grid-cols-5 gap-4 items-center justify-center">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button key={num} variant="ghost" size="icon" onClick={() => setStars(num)}>
              <Star
                className="w-12 h-12"
                fill={stars >= num ? '#FFD700' : 'none'}
                stroke={stars >= num ? '#FFD700' : 'black'}
              />
            </Button>
          ))}
        </div>

        <Button
          onClick={handleCreateReview}
          className="bg-[#00FF84] text-black text-[20px] font-oswald p-5 w-[100px] h-[45px] font-normal items-center justify-center hover:bg-[#00CC6E] border border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
