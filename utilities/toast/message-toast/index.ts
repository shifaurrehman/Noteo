import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info" | "warning";

interface BaseToastProps {
  title?: string;
  message: string;
}

interface InternalToastProps extends BaseToastProps {
  type: ToastType;
}

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: "Success",
  error: "Error",
  info: "Info",
  warning: "Warning",
};

const showMessageToast = ({ type, title, message }: InternalToastProps) => {
  Toast.show({
    type: type,
    text1: title ?? DEFAULT_TITLES[type],
    text2: message,
  });
};

export const showInfoToast = (props: BaseToastProps) => {
  showMessageToast({ ...props, type: "info" });
};

export const showSuccessToast = (props: BaseToastProps) => {
  showMessageToast({ ...props, type: "success" });
};

export const showWarningToast = (props: BaseToastProps) => {
  showMessageToast({ ...props, type: "warning" });
};

export const showErrorToast = (props: BaseToastProps) => {
  showMessageToast({ ...props, type: "error" });
};
