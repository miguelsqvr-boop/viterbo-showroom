import { notFound } from 'next/navigation';
import { ProjectView } from '@/components/ProjectView';
import { PROJECTS, projectBySlug } from '@/content/projects';

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  return <ProjectView project={project} />;
}
