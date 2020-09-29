import React from "react";
import { toast, ToastOptions, ToastContent } from "react-toastify";

export default {
  toast: (
    content: ToastContent,
    options: ToastOptions = {}
  ): React.ReactText => {
    return toast.warn(content, {
      ...options,
      className: `${options.className || ""} notification is-primary`,
    });
  },
  danger: (
    content: ToastContent,
    options: ToastOptions = {}
  ): React.ReactText => {
    return toast.error(content, {
      ...options,
      className: `${options.className || ""} notification is-danger`,
    });
  },
  success: (
    content: ToastContent,
    options: ToastOptions = {}
  ): React.ReactText => {
    return toast.success(content, {
      ...options,
      className: `${options.className || ""} notification is-success`,
    });
  },
  info: (
    content: ToastContent,
    options: ToastOptions = {}
  ): React.ReactText => {
    return toast.info(content, {
      ...options,
      className: `${options.className || ""} notification is-info`,
    });
  },
  warning: (
    content: ToastContent,
    options: ToastOptions = {}
  ): React.ReactText => {
    return toast.warn(content, {
      ...options,
      className: `${options.className || ""} notification is-warning`,
    });
  },
  dismiss: toast.dismiss,
  clearWaitingQueue: toast.clearWaitingQueue,
  isActive: toast.isActive,
  update: toast.update,
  done: toast.done,
  onChange: toast.onChange,
  configure: toast.configure,
  POSITION: toast.POSITION,
  TYPE: toast.TYPE,
};
