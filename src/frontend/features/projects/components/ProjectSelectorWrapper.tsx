'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProjectSelector from './ProjectSelector';
import type { ProjectDTO } from '@/shared/types/project';

interface ProjectSelectorWrapperProps {
  userName?: string;
  projects?: ProjectDTO[];
}

const ProjectSelectorWrapper: React.FC<ProjectSelectorWrapperProps> = ({
  userName,
  projects = [],
}) => {
  const router = useRouter();

  return (
    <ProjectSelector
      userName={userName}
      projects={projects}
      onSelectProject={(projectId) => router.push(`/dashboard?project=${projectId}`)}
      onCreateProject={() => router.push('/projects/new')}
    />
  );
};

export default ProjectSelectorWrapper;
