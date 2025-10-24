import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Admin' | 'Front-desk' | 'Doctor' | 'Nurse' | 'Lab tech' | 'Scan tech';
export type Gender = 'Male' | 'Female' | 'Other';

export interface DoctorDetails {
  speciality: string;
  qualification: string;
  registrationNo: string;
  yearsOfExperience: number;
}

export interface User {
  id: string;
  firstName: string;
  username: string;
  gender: Gender;
  contact: string;
  email: string;
  password: string;
  profilePhoto?: string;
  userRole: UserRole;
  doctorDetails?: DoctorDetails;
  createdAt: Date;
}

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getDoctors: () => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, ...userData } : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getDoctors = () => {
    return users.filter(user => user.userRole === 'Doctor');
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
        getDoctors,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within UserProvider');
  }
  return context;
}
