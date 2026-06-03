export type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    meta?: unknown;
};

export type Category = { id: number; name: string; slug: string; description?: string; is_active?: boolean; jobs_count?: number };
export type Location = { id: number; name: string; slug: string; country?: string; is_active?: boolean; jobs_count?: number };
export type Skill = { id: number; name: string; slug: string };
export type Company = {
    id: number;
    name: string;
    slug: string;
    industry?: string;
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
    description?: string;
    verification_status: 'pending' | 'approved' | 'rejected';
    is_active: boolean;
    jobs_count?: number;
    user?: { id: number; name: string; email: string };
};
export type Job = {
    id: number;
    title: string;
    slug: string;
    description: string;
    responsibilities?: string;
    requirements?: string;
    benefits?: string;
    salary_min?: number;
    salary_max?: number;
    salary_currency: string;
    job_type: string;
    experience_level: string;
    deadline: string;
    status: string;
    is_featured: boolean;
    applications_count?: number;
    company?: Company;
    category?: Category;
    location?: Location;
    skills?: Skill[];
};
export type Application = {
    id: number;
    status: string;
    cover_letter?: string;
    cv_file?: string;
    user?: any;
    job?: Job;
};
