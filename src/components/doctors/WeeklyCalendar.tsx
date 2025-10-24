import { useEffect } from 'react'; // Add useEffect
import { Trash2, Clock } from 'lucide-react';
import { useAvailability, DayOfWeek } from '@/contexts/AvailabilityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WeeklyCalendarProps {
  doctorId: string;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const dayColors: Record<DayOfWeek, string> = {
  Monday: 'bg-blue-500/10 border-blue-500/30',
  Tuesday: 'bg-purple-500/10 border-purple-500/30',
  Wednesday: 'bg-green-500/10 border-green-500/30',
  Thursday: 'bg-orange-500/10 border-orange-500/30',
  Friday: 'bg-pink-500/10 border-pink-500/30',
  Saturday: 'bg-cyan-500/10 border-cyan-500/30',
  Sunday: 'bg-red-500/10 border-red-500/30',
};

export function WeeklyCalendar({ doctorId }: WeeklyCalendarProps) {
  const { getDoctorAvailability, deleteTimeSlot, deleteAvailability } = useAvailability();
  const availabilities = getDoctorAvailability(doctorId);

  const handleDeleteSlot = (availabilityId: string, slotId: string, availabilityDay: DayOfWeek) => {
    const availability = availabilities.find(a => a.id === availabilityId);
    if (availability && availability.timeSlots.length === 1) {
      // If it's the last slot, delete the entire availability
      deleteAvailability(availabilityId);
      toast.success(`Removed all slots for ${availabilityDay}`);
    } else {
      deleteTimeSlot(availabilityId, slotId);
      toast.success('Time slot deleted');
    }
  };

  if (availabilities.length === 0) {
    return (
      <Card className="shadow-elevated border-border/50 ">
        <CardHeader className="gradient-subtle border-b border-gray-200">
          <CardTitle className="text-xl">Weekly Schedule</CardTitle>
          <CardDescription>
            No availability set for selected doctor
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 ">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Clock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No Schedule Added</h3>
            <p className="text-muted-foreground">Add availability using the form above</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated border-border/50 bg-blue-50">
      <CardHeader className="gradient-subtle border-b border-gray-200">
        <CardTitle className="text-xl">Weekly Schedule</CardTitle>
        <CardDescription>
          Current availability for the selected doctor
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {DAYS_OF_WEEK.map(day => {
            const dayAvailabilities = availabilities.filter(a => a.dayOfWeek === day);
            
            return (
              <div
                key={day}
                className={cn(
                  'rounded-xl border-2 p-4 transition-smooth',
                  dayAvailabilities.length > 0 ? dayColors[day] : 'bg-muted/30 border-border'
                )}
              >
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {day}
                </h3>
                
                {dayAvailabilities.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No slots</p>
                ) : (
                  <div className="space-y-2">
                    {dayAvailabilities.map(availability =>
                      availability.timeSlots.map(slot => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between gap-2 p-3 rounded-lg bg-card border border-border shadow-soft"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {slot.startTime} - {slot.endTime}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSlot(availability.id, slot.id, day)}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}