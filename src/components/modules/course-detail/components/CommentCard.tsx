import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CourseReview } from '@/types/course_review';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Star, Edit, Trash, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ReviewService from '@/apis/reviewService';
import { Course } from '@/types/courses';

interface CommentCardProps {
  review: CourseReview;
  setCourse?: React.Dispatch<React.SetStateAction<Course | null>>;
}
export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
}
const CommentCard: React.FC<CommentCardProps> = ({ review, setCourse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(review.comment || '');
  const [newRating, setNewRating] = useState(review.rating || 0);
  const token = localStorage.getItem('accessToken');
  let currentUserId = '';
  console.log('review.userId' + review.userId);
  console.log('review.currentUserId' + currentUserId);
  const handleUpdateReview = () => {
    setIsEditing(true);
  };
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      currentUserId = decoded.sub;
      console.log('Decoded userId:', currentUserId);
    } catch (err) {
      console.error('Invalid token', err);
    }
  }
  const handleSaveReview = async () => {
    if (!newComment.trim() || newRating === 0) {
      toast.error('Hãy nhập bình luận và đánh giá sao!');
      return;
    }

    const updateReview: Partial<CourseReview> = {
      reviewId: review.reviewId, // Tạo ID ngẫu nhiên (tránh trùng lặp)
      courseId: review.courseId,
      userId: review.userId ? review.userId : 'a2b0cf54-38f7-4b78-b501-e3d17961c68e',
      rating: newRating,
      comment: newComment,
      createdAt: review.createdAt,
      updatedAt: new Date(),
    };

    const result = await ReviewService.updateReview(
      review.reviewId || 'a2b0cf54-38f7-4b78-b501-e3d17961c68e',
      updateReview
    );
    if (result) {
      console.log('Review updated successfully:', result);
      setCourse?.((prevCourse) => {
        if (!prevCourse) return prevCourse;
        return {
          ...prevCourse,
          reviews: (prevCourse.reviews ?? []).map((r) =>
            r.reviewId === result.reviewId ? result : r
          ),
        };
      });
    } else {
      console.error('Failed to create review');
    }
    setNewComment('');
    setNewRating(0);
    setIsEditing(false);
  };

  const handleDeleteReview = async () => {
    toast(
      (t) => (
        <div>
          <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                toast.dismiss(t.id); // Đóng hộp thoại xác nhận
                try {
                  const result = await ReviewService.deleteReview(review.reviewId);
                  if (result) {
                    toast.success('Đánh giá đã được xóa thành công!');
                    setCourse?.((prevCourse) => {
                      if (!prevCourse) return prevCourse;
                      return {
                        ...prevCourse,
                        reviews: (prevCourse.reviews ?? []).filter(
                          (r) => r.reviewId !== review.reviewId
                        ),
                      };
                    });
                  } else {
                    toast.error('Không thể xóa đánh giá. Vui lòng thử lại!');
                  }
                } catch (error) {
                  toast.error('Đã xảy ra lỗi khi xóa đánh giá!');
                  console.error('Error deleting review:', error);
                }
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <Card className="col-span-1 rounded-none border-0 shadow-none">
      <hr className="bg-black h-1" />
      <div className="grid grid-cols-5 gap-2 pt-4">
        <Avatar className="col-span-1">
          <AvatarImage
            src={review.user?.avatar || 'https://github.com/shadcn.png'}
            alt={review.user?.firstName || 'User'}
          />
          <AvatarFallback>{review.user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col col-span-3">
          <h1 className="text-[15px] font-robotoCondensed font-normal m-0 p-0">
            {review.user?.firstName || 'User'} {review.user?.lastName || 'Test'}
          </h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center">
              <h1 className="pr-3 text-[15px] font-robotoCondensed font-normal">{newRating}</h1>
              {/* Hiển thị Rating */}
              {isEditing ? (
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 cursor-pointer ${
                        star <= newRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                </div>
              ) : (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 " />
              )}

              <h1 className="pl-3 text-[15px] font-robotoCondensed font-normal">
                {new Date(review.createdAt || '').toLocaleDateString()}
              </h1>
            </div>
          </div>
        </div>
        {review.user?.userId === currentUserId && (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white shadow-lg border border-gray-200"
              >
                <DropdownMenuItem onClick={handleUpdateReview}>
                  <Edit className="w-4 h-4 mr-2" />
                  Sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteReview} className="text-red-500">
                  <Trash className="w-4 h-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Nếu đang chỉnh sửa thì hiển thị input */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="w-full border p-2 rounded-md"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="mt-2 mb-4" onClick={handleSaveReview}>
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
        </div>
      ) : (
        <p className="text-[15px] font-robotoCondensed font-normal">
          {review.comment || 'Không có bình luận'}
        </p>
      )}
    </Card>
  );
};

export default CommentCard;
