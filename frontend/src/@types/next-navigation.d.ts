// This is a simplified declaration file for Next.js navigation
declare module 'next/navigation' {
  export function useRouter(): {
    back: () => void;
    forward: () => void;
    refresh: () => void;
    push: (href: string) => void;
    replace: (href: string) => void;
    prefetch: (href: string) => void;
  };
  
  export function usePathname(): string;
  
  export function useSearchParams(): {
    get: (key: string) => string | null;
    has: (key: string) => boolean;
    getAll: (key: string) => string[];
    entries: () => IterableIterator<[string, string]>;
    keys: () => IterableIterator<string>;
    values: () => IterableIterator<string>;
    toString: () => string;
  };
}
