import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Clock } from 'lucide-react';
import { availabilitySchema, type AvailabilityInput } from '@/lib/validations';
import { useAvailability, DayOfWeek } from '@/contexts/AvailabilityContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AvailabilityFormProps {
  doctorId: string;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AvailabilityForm({ doctorId }: AvailabilityFormProps) {
  const { addAvailability, availabilities } = useAvailability();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AvailabilityInput>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      doctorId,
      dayOfWeek: undefined, 
      timeSlots: [{ startTime: '', endTime: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeSlots',
  });

  const selectedDay = watch('dayOfWeek');
  const timeSlots = watch('timeSlots');

  // Update doctorId in form when prop changes
  useEffect(() => {
    console.log("AvailabilityForm - Doctor ID updated:", doctorId);
    setValue('doctorId', doctorId);
    // Reset the form when doctor changes
    reset({
      doctorId,
      dayOfWeek: undefined, // Reset to undefined
      timeSlots: [{ startTime: '', endTime: '' }],
    });
  }, [doctorId, setValue, reset]);

  const checkOverlap = (newStart: string, newEnd: string, excludeIndex?: number): boolean => {
    const newStartTime = new Date(`2000-01-01T${newStart}`);
    const newEndTime = new Date(`2000-01-01T${newEnd}`);

    // Check within current form slots
    for (let i = 0; i < timeSlots.length; i++) {
      if (excludeIndex !== undefined && i === excludeIndex) continue;
      if (!timeSlots[i].startTime || !timeSlots[i].endTime) continue;

      const slotStart = new Date(`2000-01-01T${timeSlots[i].startTime}`);
      const slotEnd = new Date(`2000-01-01T${timeSlots[i].endTime}`);

      if (
        (newStartTime >= slotStart && newStartTime < slotEnd) ||
        (newEndTime > slotStart && newEndTime <= slotEnd) ||
        (newStartTime <= slotStart && newEndTime >= slotEnd)
      ) {
        return true;
      }
    }

    // Check against existing availability
    if (selectedDay) {
      const existingSlots = availabilities
        .filter(a => a.doctorId === doctorId && a.dayOfWeek === selectedDay)
        .flatMap(a => a.timeSlots);

      for (const slot of existingSlots) {
        const slotStart = new Date(`2000-01-01T${slot.startTime}`);
        const slotEnd = new Date(`2000-01-01T${slot.endTime}`);

        if (
          (newStartTime >= slotStart && newStartTime < slotEnd) ||
          (newEndTime > slotStart && newEndTime <= slotEnd) ||
          (newStartTime <= slotStart && newEndTime >= slotEnd)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const onSubmit = (data: AvailabilityInput) => {
    const currentDoctorId = doctorId;
    console.log("Submitting availability for doctor:", currentDoctorId);

    // Check for overlaps
    for (let i = 0; i < data.timeSlots.length; i++) {
      const slot = data.timeSlots[i];
      if (checkOverlap(slot.startTime, slot.endTime, i)) {
        toast.error('Time slots cannot overlap');
        return;
      }
    }

    const slotsWithIds = data.timeSlots.map(slot => ({
      id: crypto.randomUUID(),
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    addAvailability({
      doctorId: currentDoctorId,
      dayOfWeek: data.dayOfWeek,
      timeSlots: slotsWithIds,
    });

    toast.success('Availability added successfully!');
    
    // Reset form with current doctorId and clear day selection
    reset({
      doctorId: currentDoctorId,
      dayOfWeek: undefined, // Reset to undefined to clear dropdown
      timeSlots: [{ startTime: '', endTime: '' }],
    });
  };

  return (
    <Card className="shadow-elevated border-border/50 bg-blue-100">
      <CardHeader className="gradient-subtle border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Add Availability</CardTitle>
            <CardDescription>
              Set available days and time slots
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day of Week *</Label>
           
            <Select 
              value={selectedDay || ''} // Use empty string if undefined
              onValueChange={(value) => setValue('dayOfWeek', value as DayOfWeek)}
            >
              <SelectTrigger className={errors.dayOfWeek ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {DAYS_OF_WEEK.map(day => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dayOfWeek && (
              <p className="text-sm text-destructive">{errors.dayOfWeek.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Time Slots *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ startTime: '', endTime: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`timeSlots.${index}.startTime`}>Start Time</Label>
                      <Input
                        id={`timeSlots.${index}.startTime`}
                        type="time"
                        {...register(`timeSlots.${index}.startTime`)}
                        className={errors.timeSlots?.[index]?.startTime ? 'border-destructive' : ''}
                      />
                      {errors.timeSlots?.[index]?.startTime && (
                        <p className="text-sm text-destructive">
                          {errors.timeSlots[index]?.startTime?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`timeSlots.${index}.endTime`}>End Time</Label>
                      <Input
                        id={`timeSlots.${index}.endTime`}
                        type="time"
                        {...register(`timeSlots.${index}.endTime`)}
                        className={errors.timeSlots?.[index]?.endTime ? 'border-destructive' : ''}
                      />
                      {errors.timeSlots?.[index]?.endTime && (
                        <p className="text-sm text-destructive">
                          {errors.timeSlots[index]?.endTime?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="mt-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {errors.timeSlots && (
              <p className="text-sm text-destructive">
                {typeof errors.timeSlots.message === 'string' && errors.timeSlots.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full gradient-primary shadow-medium hover:shadow-elevated transition-smooth">
            <Plus className="mr-2 h-4 w-4" />
            Save Availability
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}