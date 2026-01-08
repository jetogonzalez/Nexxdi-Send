interface ApplePaginationProps {
  currentIndex: number;
  totalPages: number;
}

export function ApplePagination({ currentIndex, totalPages }: ApplePaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ease-in-out ${
            index === currentIndex
              ? 'w-8 h-2 bg-textPrimary rounded-full'
              : 'w-2 h-2 bg-textPrimary/30 rounded-full'
          }`}
          style={{
            transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
    </div>
  );
}
