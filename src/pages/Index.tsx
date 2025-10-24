import { useState, useMemo } from "react";
import { Activity, Users as UsersIcon, Calendar } from "lucide-react";
import { RegistrationForm } from "@/components/users/RegistrationForm";
import { UserFilters } from "@/components/users/UserFilters";
import { UserTable } from "@/components/users/UserTable";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { AvailabilityManager } from "@/components/doctors/AvailabilityManager";
import { useUsers, User, UserRole } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import DeleteModal from "@/components/DeleteModal";

const Index = () => {
  const { users, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null as string | null,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userRole.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || user.userRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // const handleDelete = (userId: string) => {
  //   if (window.confirm("Are you sure you want to delete this user?")) {
  //     deleteUser(userId);
  //     toast.success("User deleted successfully");
  //   }
  // };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      setDeleteModal({ isOpen: false, userId: null });
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const openDeleteModal = (userId: string) => {
    setDeleteModal({
      isOpen: true,
      userId,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-purple-200 to-indigo-400 border-1 border-light border-gray-200 rounded">
      <header className="sticky top-0 z-50 w-full bg-card/95 rounded-t backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-medium">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BLUECRIMSON</h1>
              <p className="text-xs text-muted-foreground">
                Assignment By Anish Pawar
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Tabs defaultValue="register" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3  bg-gradient-to-t from-blue-200 to-blue-500 shadow-lg rounded-lg p-1 border border-blue-400">
            <TabsTrigger
              value="register"
              className="flex items-center gap-2 px-4 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-primary/20 data-[state=inactive]:text-white data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-200/50 transition-colors duration-200 border border-transparent"
            >
              <UsersIcon className="h-4 w-4" />
              Register User
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 px-4 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-primary/20 data-[state=inactive]:text-white data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-200/50 transition-colors duration-200 border border-transparent"
            >
              <UsersIcon className="h-4 w-4" />
              User List
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="flex items-center gap-2 px-4 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-primary/20 data-[state=inactive]:text-white data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-200/50 transition-colors duration-200 border border-transparent"
            >
              <Calendar className="h-4 w-4" />
              Doctor Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-8">
            <RegistrationForm />
          </TabsContent>

          <TabsContent value="users" className="space-y-8 ">
            <Card className="shadow-elevated border-border/50 bg-blue-100 ">
              <CardHeader className="gradient-subtle border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UsersIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Registered Users</CardTitle>
                    <CardDescription>
                      {filteredUsers.length}{" "}
                      {filteredUsers.length === 1 ? "user" : "users"} found
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <UserFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  roleFilter={roleFilter}
                  onRoleFilterChange={setRoleFilter}
                />
                <UserTable
                  users={filteredUsers}
                  onEdit={handleEdit}
                  // onDelete={handleDelete}
                  onDelete={openDeleteModal}
                />
                <DeleteModal
                  isOpen={deleteModal.isOpen}
                  onClose={() =>
                    setDeleteModal({ isOpen: false, userId: null })
                  }
                  onConfirm={() => handleDelete(deleteModal.userId!)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-8">
            <AvailabilityManager />
          </TabsContent>
        </Tabs>
      </main>

      <EditUserDialog
        user={editingUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default Index;
