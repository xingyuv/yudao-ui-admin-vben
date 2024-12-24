import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip';

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: (...args: any[]) => void;
  cancel?: (...args: any[]) => void;
  icon?: string;
}
export interface ActionItem extends ButtonProps {
  onClick?: (...args: any[]) => void;
  class?: string;
  // 16进制颜色
  color?: string;
  label?: string;
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: string[];
  // 业务控制是否显示
  ifShow?: ((action: ActionItem) => boolean) | boolean;
  tooltip?: string | TooltipProps;
}
