"use client";

import { ReactNode } from "react";
import { GamePanel, GameButton } from "@/components/GameUI";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "danger";
  }>;
}

export function Modal({ isOpen, title, children, onClose, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GamePanel title={title} className="max-w-md w-full mx-4">
        <div className="mb-6">{children}</div>
        {actions && (
          <div className="flex gap-2">
            {actions.map((action) => (
              <GameButton
                key={action.label}
                onClick={action.onClick}
                className={`flex-1 ${
                  action.variant === "danger" ? "border-[#ff0055] text-[#ff0055]" : ""
                }`}
              >
                {action.label}
              </GameButton>
            ))}
            <GameButton onClick={onClose} className="flex-1">
              CANCEL
            </GameButton>
          </div>
        )}
      </GamePanel>
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  isDangerous = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GamePanel title={title} className="max-w-sm w-full mx-4">
        <div className="mb-6 text-[#94a3b8] font-mono text-sm">{message}</div>
        <div className="flex gap-2">
          <GameButton
            onClick={onConfirm}
            className={`flex-1 ${isDangerous ? "border-[#ff0055] text-[#ff0055]" : ""}`}
          >
            {confirmLabel}
          </GameButton>
          <GameButton onClick={onCancel} className="flex-1">
            {cancelLabel}
          </GameButton>
        </div>
      </GamePanel>
    </div>
  );
}

