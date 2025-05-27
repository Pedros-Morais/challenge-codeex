// This is a simplified declaration file for Ant Design Icons
declare module '@ant-design/icons' {
  import React from 'react';
  export interface IconProps {
    className?: string;
    style?: React.CSSProperties;
    spin?: boolean;
    rotate?: number;
    twoToneColor?: string;
  }
  
  export type IconComponent = React.FC<IconProps>;
  
  // Export icons components that are used in the project
  export const CalendarOutlined: IconComponent;
  export const CheckCircleOutlined: IconComponent;
  export const ClockCircleOutlined: IconComponent;
  export const CloseCircleOutlined: IconComponent;
  export const InfoCircleOutlined: IconComponent;
  export const PlusOutlined: IconComponent;
  export const FilterOutlined: IconComponent;
  export const SettingOutlined: IconComponent;
  export const TagOutlined: IconComponent;
  export const ToolOutlined: IconComponent;
  export const ClearOutlined: IconComponent;
  export const CheckOutlined: IconComponent;
  export const FieldTimeOutlined: IconComponent;
  export const LeftOutlined: IconComponent;
  export const RightOutlined: IconComponent;
  export const EditOutlined: IconComponent;
  export const DeleteOutlined: IconComponent;
  export const PlusCircleOutlined: IconComponent;
  export const ExclamationCircleOutlined: IconComponent;
  export const SearchOutlined: IconComponent;
  export const QuestionCircleOutlined: IconComponent;
  export const ArrowLeftOutlined: IconComponent;
  export const ArrowRightOutlined: IconComponent;
  export const HomeOutlined: IconComponent;
  export const DashboardOutlined: IconComponent;
  export const SettingFilled: IconComponent;
  export const MenuOutlined: IconComponent;
  export const UserOutlined: IconComponent;
  export const TeamOutlined: IconComponent;
  export const PartitionOutlined: IconComponent;
  export const AppstoreOutlined: IconComponent;
  export const BarsOutlined: IconComponent;
}
