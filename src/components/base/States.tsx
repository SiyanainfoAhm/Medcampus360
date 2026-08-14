interface StateProps {
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, message, action }: StateProps) {
  return (
    <div className="bg-white border border-dashed border-line-300 rounded-lg py-14 px-6 flex flex-col items-center text-center">
      <span className="w-12 h-12 rounded-full bg-canvas-100 flex items-center justify-center text-ink-400 mb-3">
        <i className="ri-inbox-line text-xl" />
      </span>
      <h3 className="text-sm font-semibold text-ink-800">{title}</h3>
      {message && <p className="text-xs text-ink-400 mt-1 max-w-sm">{message}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 inline-flex items-center gap-1.5 h-9 px-3.5 text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-md whitespace-nowrap">
          <i className="ri-add-line" />
          {action.label}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Unable to load data', message, action }: StateProps) {
  return (
    <div className="bg-white border border-line-200 rounded-lg py-14 px-6 flex flex-col items-center text-center">
      <span className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-3">
        <i className="ri-error-warning-line text-xl" />
      </span>
      <h3 className="text-sm font-semibold text-ink-800">{title}</h3>
      {message && <p className="text-xs text-ink-400 mt-1 max-w-sm">{message}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 inline-flex items-center gap-1.5 h-9 px-3.5 text-sm font-medium text-white bg-clinic-700 hover:bg-clinic-800 rounded-md whitespace-nowrap">
          <i className="ri-refresh-line" />
          {action.label}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3">
      <span className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );
}

export function PermissionDenied({ message }: { message?: string }) {
  return (
    <div className="bg-white border border-line-200 rounded-lg py-16 px-6 flex flex-col items-center text-center">
      <span className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
        <i className="ri-lock-2-line text-xl" />
      </span>
      <h3 className="text-sm font-semibold text-ink-800">Access restricted</h3>
      <p className="text-xs text-ink-400 mt-1 max-w-sm">
        {message || 'Your current role does not have permission to view this module. Switch roles to continue.'}
      </p>
    </div>
  );
}