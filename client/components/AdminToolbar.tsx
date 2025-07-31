import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, MessageCircle, FileText, AlertTriangle, Users, Share2, BarChart3, Shield, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { AdminChatWindow } from './AdminChatWindow';
import { BugReportSystem } from './BugReportSystem';
import { DocumentationViewer } from './DocumentationViewer';
import { SocialMediaShare } from './SocialMediaShare';
import { AITaskAssignmentSystem } from './AITaskAssignmentSystem';
import { useAuth } from './AuthContext';
import { DEFAULT_QUICK_ACTIONS, AdminQuickAction } from '../shared/adminToolbarTypes';

interface AdminToolbarProps {
  className?: string;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'docs' | 'reports' | 'tasks' | 'share'>('chat');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const { user, isAdmin } = useAuth();
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Only show to admin users
  if (!isAdmin || !user) {
    return null;
  }

  const handleQuickAction = (action: AdminQuickAction) => {
    if (action.action.startsWith('/')) {
      window.location.href = action.action;
    } else {
      // Handle custom actions
      console.log('Quick action:', action.action);
    }
  };

  const tabConfig = [
    {
      id: 'chat' as const,
      label: 'AI Chat',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages.toString() : undefined
    },
    {
      id: 'tasks' as const,
      label: 'Tasks',
      icon: Users,
      badge: undefined
    },
    {
      id: 'reports' as const,
      label: 'Reports',
      icon: AlertTriangle,
      badge: pendingReports > 0 ? pendingReports.toString() : undefined
    },
    {
      id: 'docs' as const,
      label: 'Docs',
      icon: FileText,
      badge: undefined
    },
    {
      id: 'share' as const,
      label: 'Share',
      icon: Share2,
      badge: undefined
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      badge: undefined
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <AdminChatWindow onUnreadChange={setUnreadMessages} />;
      case 'tasks':
        return <AITaskAssignmentSystem />;
      case 'reports':
        return <BugReportSystem onPendingChange={setPendingReports} />;
      case 'docs':
        return <DocumentationViewer />;
      case 'share':
        return <SocialMediaShare />;
      case 'settings':
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sticky Admin Button */}
      <motion.div
        className={`fixed top-1/2 right-4 z-50 transform -translate-y-1/2 ${className}`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg rounded-full w-12 h-12 p-0"
          title="Admin Console"
        >
          <Settings className="w-5 h-5" />
          {(unreadMessages > 0 || pendingReports > 0) && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
              {unreadMessages + pendingReports}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Sliding Admin Console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={toolbarRef}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-[400px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Admin Console</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Coin Krazy Management</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="flex flex-col items-center p-2 h-auto space-y-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-xs">{action.label}</span>
                      {action.badge && (
                        <Badge className="bg-red-500 text-white text-xs">{action.badge}</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      {tab.label}
                      {tab.badge && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 rounded-full flex items-center justify-center">
                          {tab.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {renderTabContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Admin Settings Component
const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    autoHideInactive: false,
    theme: 'auto' as 'light' | 'dark' | 'auto',
    position: 'right' as 'left' | 'right'
  });

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Console Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Notifications
              </label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sound Alerts
              </label>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-hide when inactive
              </label>
              <input
                type="checkbox"
                checked={settings.autoHideInactive}
                onChange={(e) => setSettings(prev => ({ ...prev, autoHideInactive: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                className="w-full rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Console Position
              </label>
              <select
                value={settings.position}
                onChange={(e) => setSettings(prev => ({ ...prev, position: e.target.value as any }))}
                className="w-full rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="right">Right Side</option>
                <option value="left">Left Side</option>
              </select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">System Info</h4>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Console Version:</span>
              <span>v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Sessions:</span>
              <span>1</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
