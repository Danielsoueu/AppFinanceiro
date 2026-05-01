import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';

interface ToastProps {
  notifications: Notification[];
}

export function Toasts({ notifications }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md min-w-[280px]",
              notif.type === 'success' && "bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-300",
              notif.type === 'error' && "bg-rose-50/90 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-300",
              notif.type === 'info' && "bg-indigo-50/90 border-indigo-200 text-indigo-800 dark:bg-indigo-950/90 dark:border-indigo-800 dark:text-indigo-300"
            )}
          >
            {notif.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notif.type === 'error' && <XCircle className="w-5 h-5" />}
            {notif.type === 'info' && <Info className="w-5 h-5" />}
            <span className="text-sm font-medium">{notif.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
