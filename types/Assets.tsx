const assets: Record<string, any> = {
  "images/logo.png": require('@/assets/images/logo.png'),
  "osteo1.png": require('@/assets/images/topics/osteo1.png'),
  "osteo2.png": require('@/assets/images/topics/osteo2.png'),
  "osteo3.png": require('@/assets/images/topics/osteo3.png'),
  "osteo4.png": require('@/assets/images/topics/osteo4.png'),
};

export function resolveImage(image?: string): any {
  if (!image) return undefined;

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return { uri: image };
  }

  const normalized = image.replace(/^\.\/?|^assets\//, '');
  const tries = [image, `assets/${normalized}`, `images/${normalized}`, normalized];

  for (const k of tries) {
    if (k && assets[k]) return assets[k];
  }

  return { uri: image };
}

export default resolveImage;
