
import React, { useState, useEffect } from 'react';
import { Project } from '@/api/entities';
import { User } from '@/api/entities';
import { Document } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, Plus, Users, FileText, Loader2 } from 'lucide-react';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import ManageMembersModal from '../components/projects/ManageMembersModal';

const ProjectCard = ({ project, user, onManageMembers }) => {
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    const fetchDocCount = async () => {
      const docs = await Document.filter({ project_id: project.id });
      setDocumentCount(docs.length);
    };
    fetchDocCount();
  }, [project.id]);

  return (
    <Card className="shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-800">{project.name}</CardTitle>
        {user?.role === 'admin' && (
            <Button variant="outline" size="sm" onClick={() => onManageMembers(project)}>
                <Users className="w-4 h-4 mr-2" />
                Manage Members
            </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 h-10">{project.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{project.member_emails?.length || 0} Members</span>
            </div>
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{documentCount} Documents</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Projects() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isManageModalOpen, setManageModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const projectList = await Project.list();
      setProjects(projectList);

      if (currentUser.role === 'admin') {
        const userList = await User.list();
        setAllUsers(userList);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setIsLoading(false);
  };
  
  const handleManageMembers = (project) => {
      setSelectedProject(project);
      setManageModal(true);
  };

  const visibleProjects = user?.role === 'admin' 
    ? projects
    : projects.filter(p => p.member_emails?.includes(user?.email));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mb-4">
              Projects
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track your ongoing research projects.
            </p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          )}
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        ) : visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map(project => (
              <ProjectCard key={project.id} project={project} user={user} onManageMembers={handleManageMembers} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-700">No Projects Found</h2>
            <p>{user?.role === 'admin' ? "Click 'Create Project' to get started." : "You have not been assigned to any projects yet."}</p>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        setIsOpen={setCreateModalOpen}
        onProjectCreated={fetchData}
      />
      
      {selectedProject && (
          <ManageMembersModal
            isOpen={isManageModalOpen}
            setIsOpen={setManageModal}
            project={selectedProject}
            allUsers={allUsers}
            onMembersUpdated={fetchData}
          />
      )}
    </div>
  );
}
