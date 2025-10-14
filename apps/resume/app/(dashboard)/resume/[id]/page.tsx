import { getResumeAction } from "../../../../actions/resume/get-resume";

export default async function ResumePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await getResumeAction(id);
  
  if (!result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }
  
  if (!result.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Resume Not Found</h1>
          <p>The requested resume could not be found.</p>
        </div>
      </div>
    );
  }
  
  const resume = result.data;
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{resume.name}</h1>
        {resume.targetRole && (
          <p className="text-lg text-muted-foreground">{resume.targetRole}</p>
        )}
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <p className="text-muted-foreground">
          Resume editor will be implemented here. This resume was created for: {resume.targetRole}
        </p>
        
        {resume.firstName && resume.lastName && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p>{resume.firstName} {resume.lastName}</p>
            {resume.email && <p>{resume.email}</p>}
            {resume.phoneNumber && <p>{resume.phoneNumber}</p>}
            {resume.location && <p>{resume.location}</p>}
          </div>
        )}
      </div>
      
      <div className="bg-card border rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Resume Data (Debug)</h2>
        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(resume, null, 2)}
        </pre>
      </div>
    </div>
  );
}
