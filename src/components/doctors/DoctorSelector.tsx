import { useUsers } from '@/contexts/UserContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onSelectDoctor: (doctorId: string) => void;
}

export function DoctorSelector({ selectedDoctorId, onSelectDoctor }: DoctorSelectorProps) {
  const { getDoctors } = useUsers();
  const doctors = getDoctors();

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No doctors registered yet. Please register a doctor first.</p>
      </div>
    );
  }

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  console.log("Selected Doctor ID:", selectedDoctorId);
  console.log("Available Doctors:", doctors.map(d => ({ id: d.id, name: d.firstName })));

  return (
    <div className="space-y-4">
      <Label htmlFor="doctor-select">Select Doctor</Label>
      <Select value={selectedDoctorId} onValueChange={onSelectDoctor}>
        <SelectTrigger id="doctor-select" className="h-auto py-3">
          <SelectValue placeholder="Choose a doctor">
            {selectedDoctor ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedDoctor.profilePhoto} />
                  <AvatarFallback className="text-xs">
                    {selectedDoctor.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>Dr. {selectedDoctor.firstName}</span>
                <span className="text-muted-foreground">
                  - {selectedDoctor.doctorDetails?.speciality}
                </span>
              </div>
            ) : (
              <span>Choose a doctor</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              <div className="flex items-center gap-3 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={doctor.profilePhoto} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {doctor.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Dr. {doctor.firstName}</p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.doctorDetails?.speciality}
                  </p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
    </div>
  );
}