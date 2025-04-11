import React from 'react';
import { Link } from 'react-router-dom';
import { BellAlertIcon, ClockIcon } from '@heroicons/react/24/outline';

interface NotificationData {
    id: string;
    type: string;
    data: {
        message: string;
        link?: string;
        product_name?: string;
        current_stock?: number;
    };
    read_at: string | null;
    created_at: string;
}

interface NotificationsDropdownProps {
    notifications: NotificationData[];
    onMarkAsRead: (id: string) => void;
    onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ notifications, onMarkAsRead, onClose }) => {

    const handleNotificationClick = (notification: NotificationData) => {
        if (!notification.read_at) {
            onMarkAsRead(notification.id);
        }
        onClose();
    };

    const timeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div
            className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="notifications-menu-button"
        >
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-md font-semibold text-slate-800">Notifications</h3>
            </div>
            <div className="py-1 max-h-96 overflow-y-auto" role="none">
                {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <BellAlertIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full text-left block px-4 py-3 text-sm transition-colors duration-150 ${notification.read_at ? 'text-slate-500' : 'text-slate-700 bg-indigo-50/50 hover:bg-indigo-100/70'
                                }`}
                            role="menuitem"
                        >
                            <p className={`font-medium ${!notification.read_at ? 'text-indigo-800' : 'text-slate-600'}`}>
                                {notification.data.product_name ? `Low Stock: ${notification.data.product_name}` : 'Notification'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{notification.data.message}</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {timeAgo(notification.created_at)}
                            </p>
                        </button>
                    ))
                )}
            </div>
            {notifications.length > 0 && (
                 <div className="p-2 border-t border-slate-100 text-center">
                    <Link to="/admin/notifications" onClick={onClose} className="text-xs text-brand-600 hover:text-brand-800 font-medium">
                        View All Notifications
                    </Link>
                 </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
