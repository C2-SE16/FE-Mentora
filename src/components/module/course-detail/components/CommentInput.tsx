import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import React from 'react';

const CommentInput = () => {
  return (
    <div>
      <div className="col-span-2 p-5 border border-black rounded-sm">
        <Textarea
          placeholder="Type your message here."
          className="border border-black"
        />
        <div className="flex flex-row justify-between pt-4">
          <div className="grid grid-cols-5 gap-4 items-center justify-center">
            <Button variant="ghost" size="icon">
              <Star className="w-12 h-12" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="w-12 h-12" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="w-12 h-12" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="w-12 h-12" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="w-12 h-12" />
            </Button>
          </div>
          <Button className="bg-[#00FF84] text-black text-[20px] font-oswald p-5 w-[100px] h-[45px] font-normal items-center justify-center hover:bg-[#00CC6E] border border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
