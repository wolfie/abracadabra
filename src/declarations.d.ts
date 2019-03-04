declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare type ValueOf<T> = T[keyof T];
