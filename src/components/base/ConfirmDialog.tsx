import Modal from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <div className="flex items-start gap-3">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50 text-red-600' : 'bg-clinic-50 text-clinic-700'}`}>
          <i className={`${danger ? 'ri-delete-bin-6-line' : 'ri-question-line'} text-lg`} />
        </span>
        <p className="text-sm text-ink-600 pt-2.5">{message}</p>
      </div>
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium bg-white border border-line-200 text-ink-700 rounded-md hover:bg-canvas-50 whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md whitespace-nowrap ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-clinic-700 hover:bg-clinic-800'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}