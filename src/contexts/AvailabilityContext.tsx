import { createContext, useContext, useState, ReactNode } from 'react';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  timeSlots: TimeSlot[];
}

interface AvailabilityContextType {
  availabilities: DoctorAvailability[];
  addAvailability: (availability: Omit<DoctorAvailability, 'id'>) => void;
  updateAvailability: (id: string, availability: Partial<DoctorAvailability>) => void;
  deleteAvailability: (id: string) => void;
  deleteTimeSlot: (availabilityId: string, slotId: string) => void;
  getDoctorAvailability: (doctorId: string) => DoctorAvailability[];
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);

  const addAvailability = (availabilityData: Omit<DoctorAvailability, 'id'>) => {
    const newAvailability: DoctorAvailability = {
      ...availabilityData,
      id: crypto.randomUUID(),
    };
    setAvailabilities(prev => [...prev, newAvailability]);
  };

  const updateAvailability = (id: string, availabilityData: Partial<DoctorAvailability>) => {
    setAvailabilities(prev =>
      prev.map(avail => (avail.id === id ? { ...avail, ...availabilityData } : avail))
    );
  };

  const deleteAvailability = (id: string) => {
    setAvailabilities(prev => prev.filter(avail => avail.id !== id));
  };

  const deleteTimeSlot = (availabilityId: string, slotId: string) => {
    setAvailabilities(prev =>
      prev.map(avail => {
        if (avail.id === availabilityId) {
          return {
            ...avail,
            timeSlots: avail.timeSlots.filter(slot => slot.id !== slotId),
          };
        }
        return avail;
      })
    );
  };

  const getDoctorAvailability = (doctorId: string) => {
    return availabilities.filter(avail => avail.doctorId === doctorId);
  };

  return (
    <AvailabilityContext.Provider
      value={{
        availabilities,
        addAvailability,
        updateAvailability,
        deleteAvailability,
        deleteTimeSlot,
        getDoctorAvailability,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability must be used within AvailabilityProvider');
  }
  return context;
}
