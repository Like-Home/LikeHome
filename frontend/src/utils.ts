export function test() {
  return null;
}

export function createHotelbedsSrcSetFromPath(path: string) {
  const baseImageUrl = 'http://photos.hotelbeds.com/giata/';
  const imageSizes = [
    { width: 320, suffix: '' },
    { width: 74, suffix: 'small/' },
    { width: 117, suffix: 'medium/' },
    { width: 800, suffix: 'bigger/' },
    { width: 1024, suffix: 'xl/' },
    { width: 2048, suffix: 'xxl/' },
  ];

  const srcset = imageSizes
    .map((size) => {
      const url = `${baseImageUrl}${size.suffix}${path}`;
      return `${url} ${size.width}w`;
    })
    .join(', ');

  return {
    src: `${baseImageUrl}${path}`,
    srcSet: srcset,
  };
}
