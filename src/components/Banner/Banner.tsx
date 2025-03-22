'use client';

import Carousel from 'react-multi-carousel';
import Link from 'next/link';
import 'react-multi-carousel/lib/styles.css';
import Image from 'next/image';

const Banner = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="w-full md-lg:mt-6">
      <div className="w-[85%] lg:w-[90%] mx-auto">
        <div className="flex flex-wrap w-full md-lg:gap-8">
          <div className="w-full">
            <div className="my-8">
              <Carousel autoPlay={true} infinite={true} arrows={true} responsive={responsive}>
                {[1, 2, 3, 4, 5].map((img, i) => (
                  <Link href="#!" key={i} className="flex justify-center items-center">
                    <Image
                      src={`/banner/${img}.jpg`}
                      alt="banner"
                      width={1340}
                      height={400}
                      className="w-[1340px] h-[400px] object-cover"
                    />
                  </Link>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
