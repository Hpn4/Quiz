const assets: Record<string, any> = {
  "images/splash-icon.png": require('@/assets/images/splash-icon.png'),
  "osteo1.png": require('@/assets/images/topics/osteo1.png'),
  "osteo2.png": require('@/assets/images/topics/osteo2.png'),
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
