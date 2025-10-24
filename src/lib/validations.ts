import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export const userRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  contact: z.string().regex(phoneRegex, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must contain uppercase, lowercase, number and special character'),
  profilePhoto: z.instanceof(File).optional()
    .refine(
      (file) => !file || file.size <= 1024 * 1024,
      'File size must be less than 1MB'
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Only JPG and PNG files are allowed'
    ),
  userRole: z.enum(['Admin', 'Front-desk', 'Doctor', 'Nurse', 'Lab tech', 'Scan tech'], {
    required_error: 'User role is required',
  }),
});

export const doctorDetailsSchema = z.object({
  speciality: z.string().min(1, 'Speciality is required').max(100, 'Speciality must be less than 100 characters'),
  qualification: z.string().min(1, 'Qualification is required').max(200, 'Qualification must be less than 200 characters'),
  registrationNo: z.string().min(1, 'Registration number is required').max(50, 'Registration number must be less than 50 characters'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be 0 or more').max(100, 'Years of experience must be less than 100'),
});

export const timeSlotSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
}).refine(
  (data) => {
    const start = new Date(`2000-01-01T${data.startTime}`);
    const end = new Date(`2000-01-01T${data.endTime}`);
    return end > start;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export const availabilitySchema = z.object({
  doctorId: z.string().min(1, 'Doctor selection is required'),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
    required_error: 'Day of week is required',
  }),
  timeSlots: z.array(timeSlotSchema).min(1, 'At least one time slot is required'),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type DoctorDetailsInput = z.infer<typeof doctorDetailsSchema>;
export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
