import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CourseReview } from '@/types/courses';
import { EllipsisVertical, Star } from 'lucide-react';
import React from 'react';

interface CommentCardProps {
  review: CourseReview;
}

const CommentCard: React.FC<CommentCardProps> = ({ review }) => {
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
          <h1 className="text-[20px] font-robotoCondensed font-normal">
            {review.user?.firstName} {review.user?.lastName}
          </h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center justify-center ">
              <h1 className="pr-3 text-[15px] font-robotoCondensed font-normal">{review.rating}</h1>
              <Button variant="ghost" size="icon">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </Button>
              <h1 className="text-[15px] font-robotoCondensed font-normal">
                {new Date(review.createdAt || '').toLocaleDateString()}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex justify-end ">
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <p className="text-[15px] font-robotoCondensed font-normal">
        {review.comment || 'Không có bình luận'}
      </p>
    </Card>
  );
};

export default CommentCard;
