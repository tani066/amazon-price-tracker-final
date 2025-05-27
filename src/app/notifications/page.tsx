import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export default async function Notifications() {
    const session = await auth()
    const user = session?.user
    if (!user) {
        return (
            <div className="col-span-9">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Please log in to view notifications</h1>
            </div>
        )
    }
    const notifications = await prisma.notification.findMany({
        where: { userEmail: user.email ?? "" },
        orderBy: { createdAt: 'desc' }, 
    })
    return(
        <div className="col-span-9"> 
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h1>
            <div>
                {notifications.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {notifications.map((notification) => (
                            <li key={notification.id} className="mb-2">
                                <strong>{notification.title}</strong> - {new Date(notification.createdAt).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notifications found.</p>
                )}
            </div>
        </div>
    )
}