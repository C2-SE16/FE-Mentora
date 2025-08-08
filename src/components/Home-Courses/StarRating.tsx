import Image from 'next/image';

export const StarRating = ({ rating }: { rating: number }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;

    if (rating >= index + 1) {
      return (
        <Image
          key={index}
          src="/star.svg" // Full star
          alt="star"
          width={16}
          height={16}
          className="inline-block"
        />
      );
    }
    // For half stars (when the rating is at least index+0.5 but less than index+1)
    else if (rating >= number) {
      return (
        <Image
          key={index}
          src="/half-star.svg"
          alt="half-star"
          width={16}
          height={16}
          className="inline-block"
        />
      );
    }
    // For empty stars
    else {
      return (
        <Image
          key={index}
          src="/empty-star.svg"
          alt="empty-star"
          width={16}
          height={16}
          className="inline-block"
        />
      );
    }
  });

  return <div className="flex gap-0.5">{stars}</div>;
};
