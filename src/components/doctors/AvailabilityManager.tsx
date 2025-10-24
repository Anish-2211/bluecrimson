import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorSelector } from './DoctorSelector';
import { AvailabilityForm } from './AvailabilityForm';
import { WeeklyCalendar } from './WeeklyCalendar';

export function AvailabilityManager() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  // Debug effect
  // useEffect(() => {
  //   console.log("AvailabilityManager - Selected Doctor ID Changed:", selectedDoctorId);
  // }, [selectedDoctorId]);

  const handleDoctorSelect = (doctorId: string) => {
    console.log("Doctor selected in AvailabilityManager:", doctorId);
    setSelectedDoctorId(doctorId);
  };

  return (
    <div className="space-y-8">
      {/* Doctor Selection */}
      <Card className="shadow-elevated border-border/50 bg-blue-100">
        <CardHeader className="gradient-subtle border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Doctor Availability Management</CardTitle>
              <CardDescription>Manage weekly schedules and time slots for doctors</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <DoctorSelector 
            selectedDoctorId={selectedDoctorId} 
            onSelectDoctor={handleDoctorSelect} 
          />
        </CardContent>
      </Card>

      {/* Availability Form and Calendar */}
      {selectedDoctorId && (
        <>
          
          <AvailabilityForm doctorId={selectedDoctorId} />
          <WeeklyCalendar doctorId={selectedDoctorId} />
        </>
      )}
    </div>
  );
}