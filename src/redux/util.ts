// TODO: add support for optional message
// TODO: conditionally replace with a noop function in production builds
export const assert = (fn: (...args: any) => boolean): true => {
  if (!fn()) throw new Error('Assert error');
  return true;
};
