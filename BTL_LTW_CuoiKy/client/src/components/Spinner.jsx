const Spinner = () => (
  <div role="status" className="flex justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
    <span className="sr-only">Đang tải...</span>
  </div>
);
export default Spinner;
