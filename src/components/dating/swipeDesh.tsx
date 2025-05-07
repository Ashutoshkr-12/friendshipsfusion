'use client';
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimationControls } from 'framer-motion';
import SwipeCard from '@/components/dating/swipeCard';
import { profiles } from '@/lib/types';
import { X } from 'lucide-react';
import { FcLike } from 'react-icons/fc';
import { Button } from '@/components/ui/button';


interface SwipeDeckProps {
  profile: profiles[];
  onSwipeLeft: (profile: profiles) => void;
  onSwipeRight: (profile: profiles) => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const currentProfile = profile[currentIndex];
  const x = useMotionValue(0);
  const controls = useAnimationControls();

  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  interface DragEndInfo {
    offset: {
      x: number;
      y: number;
    };
  }


  const handleDragEnd = async (_: any, info: DragEndInfo) => {
    const direction = info.offset.x > 100 ? 'right' : info.offset.x < -100 ? 'left' : null;
    //console.log('Outer drag ended with offset:', info.offset.x, 'Direction:', direction);

    if (direction === 'left') {
      await controls.start({ x: -500, opacity: 0 });
      onSwipeLeft(currentProfile);
      if (currentIndex < profile.length - 1) setCurrentIndex(currentIndex + 1);
    } else if (direction === 'right') {
      await controls.start({ x: 500, opacity: 0 });
      onSwipeRight(currentProfile);
      if (currentIndex < profile.length - 1) setCurrentIndex(currentIndex + 1);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleButtonSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'left') {
      await controls.start({ x: -500, opacity: 0 });
      onSwipeLeft(currentProfile);
    } else {
      await controls.start({ x: 500, opacity: 0 });
      onSwipeRight(currentProfile);
    }
    if (currentIndex < profile.length - 1) {
      setCurrentIndex(currentIndex + 1);
      controls.set({ x: 0, opacity: 1 });
    }

    if (profile.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-4">No more profiles to show!</h2>
          <p className="text-gray-500 mb-4">Check back later for more matches</p>
          <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
        </div>
      );
    }
  };

 

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto mt-8">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        animate={controls}
        className="relative"
      >
        <motion.div
          className="absolute top-10 right-10 bg-green-500 text-white text-2xl font-bold p-4 rounded-lg z-10 border-4 border-white transform rotate-12"
          style={{ opacity: likeOpacity }}
        >
          YES
        </motion.div>
        <motion.div
          className="absolute top-10 left-10 bg-red-500 text-white text-2xl font-bold p-4 rounded-lg z-10 border-4 border-white transform -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>
        <SwipeCard
          profile={currentProfile}
          onSwipeLeft={() => {
            onSwipeLeft(currentProfile);
            if (currentIndex < profile.length - 1) setCurrentIndex(currentIndex + 1);
          }}
          onSwipeRight={() => {
            onSwipeRight(currentProfile);
            if (currentIndex < profile.length - 1) setCurrentIndex(currentIndex + 1);
          }}
        />
      </motion.div>
      <div className="flex justify-center gap-10 mt-6 mb-20 md:mb-6">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => handleButtonSwipe('left')}
        >
          <X size={30} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50"
          onClick={() => handleButtonSwipe('right')}
        >
          <FcLike size={30} />
        </Button>
      </div>
    </div>
  );
};

export default SwipeDeck;