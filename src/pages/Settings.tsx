import { PageNavigation } from '../components/PageNavigation'

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col bg-[#181A1F] text-white">
      <PageNavigation />
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-xl border border-[#363941] bg-[#25272d] px-8 py-6 text-center">
          <h2 className="text-[20px] font-semibold">Settings</h2>
          <p className="mt-2 text-[12px] text-[#A7ABB5]">Workspace preferences and admin controls.</p>
        </div>
      </div>
    </div>
  )
}
