// This is a simplified declaration file for Next.js Image component
declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string | StaticImport;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    loader?: ImageLoader;
    quality?: number | string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
    lazyBoundary?: string;
    lazyRoot?: React.RefObject<HTMLElement>;
  }

  interface StaticImport {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  }

  interface ImageLoader {
    (resolverProps: ImageLoaderProps): string;
  }

  interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number | string;
  }

  const Image: React.FC<ImageProps>;
  export default Image;
}
