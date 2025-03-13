import React from 'react';

const requirements = [
  'Familiarity with using computers and navigating software applications',
  'Basic understanding of English to follow course instructions and complete assignments',
  'This course is designed for beginners and intermediate learners, so prior knowledge of software testing is not required',
  'A laptop or desktop computer with internet access to complete course materials and projects',
];

const descriptions = [
  'The Complete Software Testing 2024 Bootcamp – All-In-One Testing Guide Ready to launch your career in software testing?',
  'This comprehensive course is designed for absolute beginners and intermediate testers who want to master the essentials and advance to an industry-ready skill set. From manual testing to automation and performance testing, this course provides everything you need to know to land your first software testing job, whether as a full-time professional or a freelancer.',
];
const CourseContent = () => {
  return (
    <div>
      <div className="col-span-2">
        <h1 className="text-[20px] font-normal font-oswald mb-2">Yêu cầu</h1>
        <ul className="list-disc pl-5 space-y-1 text-[15px] font-normal font-robotoCondensed w-full max-w-full">
          {requirements.map((item, index) => (
            <li key={index} className="w-full max-w-full break-words">
              {item}
            </li>
          ))}
        </ul>

        <h1 className="text-[20px] font-normal font-oswald mb-2 mt-7">Mô tả</h1>
        <ul className="list-disc pl-5 space-y-1 text-[15px] font-normal font-robotoCondensed w-full max-w-full">
          {descriptions.map((item, index) => (
            <li key={index} className="w-full max-w-full break-words">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseContent;
