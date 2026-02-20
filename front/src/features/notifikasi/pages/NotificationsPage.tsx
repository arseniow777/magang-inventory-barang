import { NotificationsList } from "../components/NotificationsList";

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifikasi</h2>
      </div>

      <NotificationsList />
    </div>
  );
}
