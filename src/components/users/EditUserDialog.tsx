import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { userRegistrationSchema, doctorDetailsSchema, type UserRegistrationInput, type DoctorDetailsInput } from '@/lib/validations';
import { User, useUsers } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { updateUser } = useUsers();
  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserRegistrationInput & { doctorDetails?: DoctorDetailsInput }>({
    resolver: zodResolver(
      showDoctorFields
        ? userRegistrationSchema.extend({ doctorDetails: doctorDetailsSchema })
        : userRegistrationSchema
    ),
  });

  const userRole = watch('userRole');

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('username', user.username);
      setValue('gender', user.gender);
      setValue('contact', user.contact);
      setValue('email', user.email);
      setValue('password', user.password);
      setValue('userRole', user.userRole);
      setShowDoctorFields(user.userRole === 'Doctor');
      setProfilePreview(user.profilePhoto || '');

      if (user.doctorDetails) {
        setValue('doctorDetails.speciality', user.doctorDetails.speciality);
        setValue('doctorDetails.qualification', user.doctorDetails.qualification);
        setValue('doctorDetails.registrationNo', user.doctorDetails.registrationNo);
        setValue('doctorDetails.yearsOfExperience', user.doctorDetails.yearsOfExperience);
      }
    }
  }, [user, setValue]);

  const handleRoleChange = (role: string) => {
    setValue('userRole', role as any);
    setShowDoctorFields(role === 'Doctor');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profilePhoto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    if (!user) return;

    try {
      const userData = {
        firstName: data.firstName,
        username: data.username,
        gender: data.gender,
        contact: data.contact,
        email: data.email,
        password: data.password,
        profilePhoto: profilePreview,
        userRole: data.userRole,
        doctorDetails: showDoctorFields ? data.doctorDetails : undefined,
      };

      updateUser(user.id, userData);
      toast.success('User updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit User</DialogTitle>
          <DialogDescription>Update user information and settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First Name *</Label>
              <Input
                id="edit-firstName"
                {...register('firstName')}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gender">Gender *</Label>
              <Select value={watch('gender')} onValueChange={(value) => setValue('gender', value as any)}>
                <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact *</Label>
              <Input
                id="edit-contact"
                {...register('contact')}
                className={errors.contact ? 'border-destructive' : ''}
              />
              {errors.contact && (
                <p className="text-sm text-destructive">{errors.contact.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-userRole">User Role *</Label>
              <Select value={userRole} onValueChange={handleRoleChange}>
                <SelectTrigger className={errors.userRole ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Front-desk">Front-desk</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Lab tech">Lab tech</SelectItem>
                  <SelectItem value="Scan tech">Scan tech</SelectItem>
                </SelectContent>
              </Select>
              {errors.userRole && (
                <p className="text-sm text-destructive">{errors.userRole.message}</p>
              )}
            </div>
          </div>

          {showDoctorFields && (
            <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wide">Doctor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-speciality">Speciality *</Label>
                  <Input
                    id="edit-speciality"
                    {...register('doctorDetails.speciality')}
                    className={errors.doctorDetails?.speciality ? 'border-destructive' : ''}
                  />
                  {errors.doctorDetails?.speciality && (
                    <p className="text-sm text-destructive">{errors.doctorDetails.speciality.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-qualification">Qualification *</Label>
                  <Input
                    id="edit-qualification"
                    {...register('doctorDetails.qualification')}
                    className={errors.doctorDetails?.qualification ? 'border-destructive' : ''}
                  />
                  {errors.doctorDetails?.qualification && (
                    <p className="text-sm text-destructive">{errors.doctorDetails.qualification.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-registrationNo">Registration No. *</Label>
                  <Input
                    id="edit-registrationNo"
                    {...register('doctorDetails.registrationNo')}
                    className={errors.doctorDetails?.registrationNo ? 'border-destructive' : ''}
                  />
                  {errors.doctorDetails?.registrationNo && (
                    <p className="text-sm text-destructive">{errors.doctorDetails.registrationNo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="edit-yearsOfExperience"
                    type="number"
                    {...register('doctorDetails.yearsOfExperience', { valueAsNumber: true })}
                    className={errors.doctorDetails?.yearsOfExperience ? 'border-destructive' : ''}
                  />
                  {errors.doctorDetails?.yearsOfExperience && (
                    <p className="text-sm text-destructive">{errors.doctorDetails.yearsOfExperience.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
