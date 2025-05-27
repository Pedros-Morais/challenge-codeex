// Global type declarations to make TypeScript more permissive with React and Ant Design

// Make TypeScript allow any import from these modules
declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useContext: any;
  export const createContext: any;
  export const memo: any;
  export const forwardRef: any;
  export const Fragment: any;
  export const Component: any;
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type ReactElement = any;
  export type CSSProperties = any;
  export type ChangeEvent<T> = any;
  export type FormEvent<T> = any;
  export type MouseEvent<T> = any;
  export type KeyboardEvent<T> = any;
  export default any;
}

declare module 'antd' {
  export const Button: any;
  export const Modal: any;
  export const Form: any;
  export const Input: any;
  export const Select: any;
  export const DatePicker: any;
  export const message: any;
  export const Space: any;
  export const Tag: any;
  export const Tooltip: any;
  export const Radio: any;
  export const Layout: any;
  export const Menu: any;
  export const Table: any;
  export const Calendar: any;
  export const Badge: any;
  export const Alert: any;
  export const Descriptions: any;
  export const Empty: any;
  export const Card: any;
  export default any;
}

declare module '@ant-design/icons' {
  export const CalendarOutlined: any;
  export const CheckCircleOutlined: any;
  export const ClockCircleOutlined: any;
  export const CloseCircleOutlined: any;
  export const InfoCircleOutlined: any;
  export const PlusOutlined: any;
  export const FilterOutlined: any;
  export const SettingOutlined: any;
  export const TagOutlined: any;
  export const ToolOutlined: any;
  export const ClearOutlined: any;
  export const CheckOutlined: any;
  export const FieldTimeOutlined: any;
  export const LeftOutlined: any;
  export const RightOutlined: any;
  export const EditOutlined: any;
  export const DeleteOutlined: any;
  export const ExclamationCircleOutlined: any;
  export const SearchOutlined: any;
  export const TableOutlined: any;
  export const ScheduleOutlined: any;
  export const UserOutlined: any;
  export const TeamOutlined: any;
  export const HomeOutlined: any;
  export const PartitionOutlined: any;
  export const AppstoreOutlined: any;
  export const BarsOutlined: any;
  export default any;
}

declare module 'react-query' {
  export const useQuery: any;
  export const useMutation: any;
  export const useQueryClient: any;
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export default any;
}

declare module 'dayjs' {
  const dayjs: any;
  export default dayjs;
}

declare module 'next/navigation' {
  export const useRouter: any;
  export const usePathname: any;
  export const useSearchParams: any;
  export default any;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

// Create a global JSX namespace to fix JSX element errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
