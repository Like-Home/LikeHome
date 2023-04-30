import { Card, Stack, Button, Typography, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useRef, Ref, useState, useEffect, useLayoutEffect } from 'react';

export default function Carousel({ children }: { children: any[] | any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [observer, setObserver] = useState<ResizeObserver | null>(null);
  const [direction, setDirection] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, left: 0, top: 0 });
  const [goLeft, setGoLeft] = useState(false);
  const [dragging, setDragging] = useState(false);

  const buttons = useEffect(() => {
    if (timer) clearInterval(timer);
    if (direction !== 0) {
      setTimer(
        setInterval(() => {
          ref.current?.scrollBy(direction * 5, 0);
        }),
      );
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [direction]);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (dragging) ref.current?.scrollBy(-e.movementX, 0);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', () => dragging && setDragging(false));
    return () => {
      document.removeEventListener('mousemove', mouseMove);
    };
  }, [ref, dragging]);

  return (
    <Stack direction="row" sx={{ maxWidth: '100%' }}>
      <Stack
        ref={ref}
        className="hide-scrollbar"
        style={{
          overflowX: 'scroll',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        direction="row"
        spacing={2}
        onMouseDown={() => setDragging(true)}
      >
        {children}
      </Stack>
    </Stack>
  );
}
