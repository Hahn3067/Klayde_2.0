
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileSearch,
  Upload,
  LayoutDashboard,
  BookOpen,
  Beaker,
  Search,
  User as UserIcon, // Renamed to avoid conflict with API User
  Users,
  FolderKanban,
  BrainCircuit, // Added for AI Chat icon
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// Correctly import the User entity
import { deleteAllCompanyData } from '@/functions/deleteAllCompanyData';


const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: createPageUrl("Projects"),
    icon: FolderKanban,
  },
  {
    title: "Knowledgebase",
    url: createPageUrl("Knowledgebase"),
    icon: BookOpen,
  },
  {
    title: "AI Search",
    url: createPageUrl("Search"),
    icon: Search,
  },
  {
    title: "AI Chat",
    url: createPageUrl("AIChat"),
    icon: BrainCircuit,
  },
  {
    title: "Team Management",
    url: createPageUrl("TeamManagement"),
    icon: Users,
  },
];

export default function Layout({ children, currentPageName }) {
  // If the current page is the Landing page, render it without the main app layout.
  if (currentPageName === 'Landing') {
    return <>{children}</>;
  }

  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me(); // This will now work correctly
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
        // Not logged in, which is fine for public pages
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl('Landing');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAllCompanyData();
      alert("All company data has been deleted successfully.");
      handleLogout(); // Log out after successful deletion
    } catch (error) {
      console.error("Failed to delete company data:", error);
      alert("Failed to delete company data. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-orange-25">
        <style>
          {`
            :root {
              --primary: 234 88 12; /* orange-600 */
              --primary-foreground: 255 255 255;
              --secondary: 254 215 170; /* orange-200 */
              --secondary-foreground: 154 52 18; /* orange-900 */
              --accent: 255 237 213; /* orange-100 */
              --accent-foreground: 154 52 18; /* orange-900 */
              --muted: 255 247 237; /* orange-50 */
              --muted-foreground: 120 113 108; /* stone-500 */
            }
            
            .bg-orange-25 {
              background-color: #fffaf7;
            }
          `}
        </style>

        <Sidebar className="border-r border-orange-200 bg-white">
          <SidebarHeader className="border-b border-orange-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Klayde</h2>
                <p className="text-sm text-orange-600 font-medium">Research Document Hub</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-orange-700 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'text-gray-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-orange-700 uppercase tracking-wider px-3 py-2">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                 <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className='text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg mb-1'
                  >
                    <Link to={createPageUrl("Upload")} className="flex items-center gap-3 px-3 py-3">
                      <Upload className="w-5 h-5" />
                      <span className="font-medium">Upload Document</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {user?.username || user?.full_name?.split(' ')[0] || 'Lab Member'}
                    </p>
                    <p className="text-xs text-orange-600 truncate">
                      {user?.department || (user?.role === 'admin' ? 'Administrator' : 'Research Team')}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
                
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setIsDeleteModalOpen(true)} 
                      className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Account</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-orange-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-800">Klayde</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-orange-25">
            {children}
          </div>
        </main>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6"/>
                    Delete Account & All Data
                </DialogTitle>
                <DialogDescription className="pt-2 text-gray-600">
                    This action is irreversible and cannot be undone. All of the following data will be permanently deleted for all users:
                    <ul className="list-disc list-inside mt-2 text-sm">
                        <li>All Documents</li>
                        <li>All Projects</li>
                        <li>All Categories</li>
                        <li>All Usage History</li>
                        <li>All Lab Information</li>
                    </ul>
                    Are you absolutely sure you want to proceed?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                    Cancel
                </Button>
                <Button 
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                >
                    {isDeleting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                    ) : (
                        "Yes, Delete Everything"
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
