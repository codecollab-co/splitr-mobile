import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiService } from '../services/ApiService';
import { useAuth } from './AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const { isSignedIn, user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSignedIn && user) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isSignedIn, user]);

  const connectSocket = async () => {
    try {
      const socketUrl = apiService.getSocketUrl();

      socketRef.current = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Real-time event listeners
      setupEventListeners();

    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  };

  const setupEventListeners = () => {
    if (!socketRef.current) return;

    // Expense events
    socketRef.current.on('expense:created', (expense) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'success',
        text1: 'New Expense',
        text2: `${expense.description} - $${expense.amount}`,
      });
    });

    socketRef.current.on('expense:updated', (expense) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'info',
        text1: 'Expense Updated',
        text2: expense.description,
      });
    });

    socketRef.current.on('expense:deleted', (expenseId) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'info',
        text1: 'Expense Deleted',
      });
    });

    // Group events
    socketRef.current.on('group:updated', (group) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'info',
        text1: 'Group Updated',
        text2: group.name,
      });
    });

    socketRef.current.on('group:member_added', (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'success',
        text1: 'New Member',
        text2: `${data.memberName} joined ${data.groupName}`,
      });
    });

    socketRef.current.on('group:member_removed', (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'info',
        text1: 'Member Left',
        text2: `${data.memberName} left ${data.groupName}`,
      });
    });

    // Settlement events
    socketRef.current.on('settlement:created', (settlement) => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'info',
        text1: 'Payment Request',
        text2: `$${settlement.amount} requested`,
      });
    });

    socketRef.current.on('settlement:completed', (settlement) => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      Toast.show({
        type: 'success',
        text1: 'Payment Completed',
        text2: `$${settlement.amount} paid`,
      });
    });

    // Notification events
    socketRef.current.on('notification', (notification) => {
      Toast.show({
        type: notification.type || 'info',
        text1: notification.title,
        text2: notification.message,
      });
    });

    // Error events
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: error.message || 'Something went wrong',
      });
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    emit,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};