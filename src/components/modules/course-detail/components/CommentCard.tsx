import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EllipsisVertical, Star } from 'lucide-react';
import React from 'react';

const CommentCard = () => {
  return (
    <Card className=" col-span-1 rounded-none border-0 shadow-none">
      <hr className=" bg-black h-1" />
      <div className="grid grid-cols-5 gap-2 pt-4">
        <Avatar className="col-span-1">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col col-span-3">
          <h1 className="text-[20px] font-robotoCondensed font-normal">Bui Anh Dat</h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center justify-center ">
              <h1 className="pr-3 text-[15px] font-robotoCondensed font-normal">4.5</h1>
              <Button variant="ghost" size="icon">
                <Star className="w-12 h-12" />
              </Button>
              <h1 className=" text-[15px] font-robotoCondensed font-normal">1 tuần trước</h1>
            </div>
          </div>
        </div>
        <div className="flex justify-end ">
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="w-12 h-12" />
          </Button>
        </div>
      </div>
      <p className="text-[15px] font-robotoCondensed font-normal">
        Made more sense as i'm starting my career in manual software testing, i was working without
        any experience in software and without any training.
      </p>
    </Card>
  );
};

export default CommentCard;
