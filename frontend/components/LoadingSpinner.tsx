export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}