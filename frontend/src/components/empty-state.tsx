type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/60 bg-white/50 px-6 py-10 text-center animate-[fadeIn_0.6s_ease-out]">
      <p className="eyebrow">Nothing yet</p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-slate">{description}</p>
    </div>
  );
}
