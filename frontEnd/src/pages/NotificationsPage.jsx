import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle2, History, Clock, Calendar } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import { Card, Button, Badge } from '../components/common';

export const NotificationsPage = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [historyLogs, setHistoryLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    fetchNotifications();
    fetchHistory();
  }, [fetchNotifications]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistoryLogs(res.data.data.history || []);
    } catch (e) {
      console.warn('Failed to load history', e);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'risk_alert':
        return <AlertTriangle className="w-4 h-4 text-[#DC2626]" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />;
      default:
        return <Info className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Analysis completions, critical risk flags, and activity audit trails.
          </p>
        </div>

        {activeTab === 'notifications' && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
          >
            <CheckCheck className="w-4 h-4 mr-1 text-[#2563EB]" /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition ${
            activeTab === 'notifications'
              ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" /> Live Alerts
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB] text-white font-bold text-[10px]">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition ${
            activeTab === 'history'
              ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" /> Activity Log
        </button>
      </div>

      {/* Content (Section 17: Grouped by date) */}
      {activeTab === 'notifications' ? (
        notifications.length === 0 ? (
          <Card className="text-center py-16 space-y-2">
            <Bell className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-[#0F172A]">All caught up!</h4>
            <p className="text-xs text-[#475569]">You have no unread notifications.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card
                key={n._id}
                className={`flex items-start justify-between p-5 transition ${
                  !n.read ? 'border-blue-300 bg-blue-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-[12px] bg-slate-100 border border-slate-200 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                      {n.title}
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                    </h4>
                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-[#475569] hover:text-[#2563EB] p-1.5 transition rounded-[8px] hover:bg-slate-100"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </Card>
            ))}
          </div>
        )
      ) : (
        historyLogs.length === 0 ? (
          <Card className="text-center py-16 space-y-2">
            <History className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs text-[#475569]">No activity logs recorded yet.</p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#E2E8F0]">
              {historyLogs.map((log) => (
                <div key={log._id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#0F172A]">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      {log.contractTitle && (
                        <span className="text-[#475569] ml-1.5">"{log.contractTitle}"</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#475569] font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )
      )}
    </div>
  );
};
