export function CreateMenu() {
  const items = ['New Chat', 'New Channel', 'New Task', 'Schedule Meeting', 'Upload File', 'Create Note']

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[200px] rounded-xl border border-[#dfe4ef] bg-white p-2 shadow-xl shadow-[#dfe7f5]/70">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className="flex w-full items-center rounded-lg px-2 py-2 text-left text-[12px] text-[#101B3D] transition-colors hover:bg-[#f5f8ff]"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
