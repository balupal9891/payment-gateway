// components/ToastContainer.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store";
import { removeToast} from "../store/slices/toastSlice";
import Toast from "./Toast";

const ToastContainer: React.FC = () => {
  const { toasts } = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
      {toasts.map((toast: any) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={(id) => dispatch(removeToast(id))}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
