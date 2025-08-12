import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, User as UserIcon, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function TeamManagement() {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const teamData = await User.list();
        setTeam(teamData);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
      setIsLoading(false);
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mb-4">
            Team Management
          </h1>
          <p className="text-gray-600 text-lg">
            View all members of your lab and their assigned roles.
          </p>
        </div>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Lab Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium text-gray-800">{member.full_name}</TableCell>
                      <TableCell className="text-gray-600">{member.email}</TableCell>
                      <TableCell>
                        {member.role === 'admin' ? (
                          <Badge className="bg-orange-100 text-orange-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            <UserIcon className="w-3 h-3 mr-1" />
                            Member
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4 text-sm text-gray-500">
              User roles and invitations are managed through the Base44 user settings dashboard.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}