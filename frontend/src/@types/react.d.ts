// This is a simplified declaration file for React
// It declares the module without reimplementing all types

declare module 'react' {
  export * from 'react';
  export default React;
  
  export interface FC<P = {}> {
    (props: P): React.ReactElement | null;
    displayName?: string;
  }
}
