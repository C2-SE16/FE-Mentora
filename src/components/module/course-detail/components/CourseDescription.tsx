import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
const learnItems = [
  'Master manual software testing fundamentals',
  'Master manual software testing fundamentals',
  'Master black-box testing techniques like equivalence partitioning and boundary value analysis',
  'Understand API testing fundamentals and hands-on experience with Postman',
];
const CourseDescription = () => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div>
      <Card className="w-full col-span-2 border border-gray-300 shadow-md rounded-none">
        <CardContent className="py-6">
          <h2 className="text-lg font-bold mb-4">Bạn sẽ học được những gì?</h2>
          <ul className="space-y-3">
            {learnItems
              .slice(0, showMore ? learnItems.length : 2)
              .map((item, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-black stroke-[1.5]" />
                  {item}
                </li>
              ))}
          </ul>
          <Button
            variant="link"
            className="text-[#26FF96] mt-3 text-sm flex items-center"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Show less' : 'Show more'}{' '}
            <ChevronDown className="w-4 h-4 ml-1 text-[#26FF96]" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDescription;
