import JobForm from '@/pages/employer/jobs/job-form';

export default function EditJob(props: any) {
    return <JobForm {...props} title="Edit job" action={`/employer/jobs/${props.job.id}`} method="patch" />;
}
