import { errors } from '@strapi/utils';

const MAX_IMAGES = 5;

const countImages = (images: unknown): number => {
  if (!images) return 0;
  if (Array.isArray(images)) return images.length;
  if (typeof images === 'object' && 'connect' in (images as any)) {
    return (images as any).connect?.length ?? 0;
  }
  if (typeof images === 'object' && 'set' in (images as any)) {
    return (images as any).set?.length ?? 0;
  }
  return 1;
};

const assertMaxImages = (data: Record<string, unknown>) => {
  if (!('images' in data)) return;
  const count = countImages(data.images);
  if (count > MAX_IMAGES) {
    throw new errors.ValidationError(`A post can have at most ${MAX_IMAGES} images.`);
  }
};

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    assertMaxImages(event.params.data);
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    assertMaxImages(event.params.data);
  },
};
