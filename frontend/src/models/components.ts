import {
  CSSProperties,
  ChangeEvent,
  MouseEventHandler,
  ReactNode,
} from "react";

export interface SidebarNavigationProps {
  isMobileView: boolean;
}

export interface ButtonProps {
  id?: string;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
  text?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "tertiary" | "secondary" | "ghost";
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  shape?: "boxy" | "rounded" | "circular";
  style?: CSSProperties;
  size?: "md" | "lg";
  collapse?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  modalActions?: ButtonProps[];
  children: React.ReactNode;
  maxWidth?: string;
}

export interface InputFieldProps {
  containerID?: string;
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  isRow?: boolean;
  value: string | number;
  onChange: (name: string, value: string) => void;
  errorMessage?: string;
  description?: string | ReactNode;
  concatenatedString?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface ColumnProps {
  id?: number;
  name: string;
  cards?: CardProps[];
  onClick?: (value: any) => void;
  onDrop?: (targetColumnId: number, targetPosition: number) => void;
  setActiveCard?: (isActive: number | null) => void;
}

export interface TagProps {
  name: string;
  id: string;
  color: string;
}

export interface CardProps {
  title: string;
  id?: number;
  column_id?: number;
  description: string;
  tag_id?: string;
  position?: number;
  tagName?: string;
  tagColor?: string;
  onDrop?: (targetColumnId: number, targetPosition: number) => void;
  setActiveCard?: (isActive: number | null) => void;
}

export interface SkeletonProps {
  onDrop?: () => void;
}

export interface SelectOption {
  text: string;
  value: string;
  icon?: ReactNode;
}

export interface SelectProps {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  value: string | null;
  onChange?: (name: string, value: string) => void;
  disabled?: boolean;
  label?: string;
  options?: SelectOption[];
  multiple?: boolean;
  onClear?: () => void;
  externalShowOptions?: boolean;
  handleSelectAll?: () => void;
  errorMessage?: string;
}

export interface OptionProps {
  id?: string;
  value: any;
  text: string;
  onClick: (value: any) => void;
  selected?: boolean;
  hasCheckbox?: boolean;
  icon?: ReactNode;
  meta?: string;
  action?: {
    text: string;
    url: string;
  };
  isDestructive?: boolean;
  iconPosition?: "start" | "end";
  secondIcon?: ReactNode;
}

export interface ColorPickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange?: (name: string, value: string) => void;
}
