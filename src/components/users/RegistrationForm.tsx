import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Upload } from "lucide-react";
import {
  userRegistrationSchema,
  doctorDetailsSchema,
  type UserRegistrationInput,
  type DoctorDetailsInput,
} from "@/lib/validations";
import { useUsers } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

export function RegistrationForm() {
  const { addUser } = useUsers();
  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<UserRegistrationInput & { doctorDetails?: DoctorDetailsInput }>({
    defaultValues: {
      gender: "",
      userRole: "",
    },
    resolver: zodResolver(
      showDoctorFields
        ? userRegistrationSchema.extend({ doctorDetails: doctorDetailsSchema })
        : userRegistrationSchema
    ),
  });

  const userRole = watch("userRole");

  const handleRoleChange = (role: string) => {
    setValue("userRole", role as any);
    setShowDoctorFields(role === "Doctor");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
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

      addUser(userData);
      toast.success("User registered successfully!");
      reset();
      setProfilePreview("");
      setShowDoctorFields(false);
    } catch (error) {
      toast.error("Failed to register user");
    }
  };

  return (
    <Card className="shadow-elevated border-border/50 bg-blue-100">
      <CardHeader className="gradient-subtle border-b border-gray-200 ">
        <div className="flex items-center gap-3 ">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">User Registration</CardTitle>
            <CardDescription>
              Add new staff member to the system
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 ">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter username"
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        className={errors.gender ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  {...register("contact")}
                  placeholder="+1 (555) 000-0000"
                  className={errors.contact ? "border-destructive" : ""}
                />
                {errors.contact && (
                  <p className="text-sm text-destructive">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="user@example.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter secure password"
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Min 8 chars, uppercase, lowercase, number & special character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userRole">User Role *</Label>
                <Controller
                  control={control}
                  name="userRole"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleRoleChange(value);
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        className={errors.userRole ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Front-desk">Front-desk</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                        <SelectItem value="Lab tech">Lab tech</SelectItem>
                        <SelectItem value="Scan tech">Scan tech</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.userRole && (
                  <p className="text-sm text-destructive">
                    {errors.userRole.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {errors.profilePhoto && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.profilePhoto.message as string}
                      </p>
                    )}
                  </div>
                  {profilePreview && (
                    <img
                      src={profilePreview}
                      alt="Preview"
                      className="h-12 w-12 rounded-lg object-cover border-2 border-border"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG or PNG, max 1MB
                </p>
              </div>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {showDoctorFields && (
            <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wide">
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speciality">Speciality *</Label>
                  <Input
                    id="speciality"
                    {...register("doctorDetails.speciality")}
                    placeholder="e.g., Cardiology"
                    className={
                      errors.doctorDetails?.speciality
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors.doctorDetails?.speciality && (
                    <p className="text-sm text-destructive">
                      {errors.doctorDetails.speciality.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input
                    id="qualification"
                    {...register("doctorDetails.qualification")}
                    placeholder="e.g., MBBS, MD"
                    className={
                      errors.doctorDetails?.qualification
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors.doctorDetails?.qualification && (
                    <p className="text-sm text-destructive">
                      {errors.doctorDetails.qualification.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration No. *</Label>
                  <Input
                    id="registrationNo"
                    {...register("doctorDetails.registrationNo")}
                    placeholder="Enter registration number"
                    className={
                      errors.doctorDetails?.registrationNo
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors.doctorDetails?.registrationNo && (
                    <p className="text-sm text-destructive">
                      {errors.doctorDetails.registrationNo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">
                    Years of Experience *
                  </Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    {...register("doctorDetails.yearsOfExperience", {
                      valueAsNumber: true,
                    })}
                    placeholder="Enter years"
                    className={
                      errors.doctorDetails?.yearsOfExperience
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors.doctorDetails?.yearsOfExperience && (
                    <p className="text-sm text-destructive">
                      {errors.doctorDetails.yearsOfExperience.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full gradient-primary shadow-medium hover:shadow-elevated transition-smooth"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Register User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
