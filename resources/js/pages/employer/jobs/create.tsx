import JobForm from '@/pages/employer/jobs/job-form';

export default function CreateJob(props: any) {
    return <JobForm {...props} title="Post job" action="/employer/jobs" method="post" />;
}
