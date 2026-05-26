import type { ReactNode } from 'react';

interface AccountPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AccountPageHeader({ title, description, action }: AccountPageHeaderProps) {
  return (
    <div className={`mb-6 pb-5 border-b border-primary-100/80 ${action ? 'flex flex-col sm:flex-row sm:items-end justify-between gap-4' : ''}`}>
      <div>
        <p className="section-label mb-1">My account</p>
        <h2 className="font-display text-xl sm:text-2xl font-black tracking-[-0.03em] text-dark">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-gray-500 font-body mt-1.5 leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
