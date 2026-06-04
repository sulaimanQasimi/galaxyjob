<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplicationRequest;
use App\Http\Requests\ContactMessageRequest;
use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\CompanyReview;
use App\Models\ContactMessage;
use App\Models\Job;
use App\Models\Location;
use App\Models\SavedJob;
use App\Models\SavedSearch;
use App\Models\Scholarship;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $liveData = $this->homepageLiveData();
        $canonicalUrl = $this->absoluteUrl(route('home', [], false));
        $description = 'Find verified jobs, trusted companies, and career opportunities in Afghanistan with Galaxy Jobs.';

        return Inertia::render('public/home', [
            ...$liveData,
            'featuredJobs' => $liveData['featured_jobs'],
            'topCompanies' => $liveData['featured_companies'],
            'latestJobs' => $liveData['featured_jobs'],
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
            'seo' => [
                'title' => 'Galaxy Jobs - Find verified jobs in Afghanistan',
                'description' => $description,
                'keywords' => 'jobs in Afghanistan, Kabul jobs, remote jobs, hiring, careers, employers',
                'canonical' => $canonicalUrl,
                'image' => $this->absoluteUrl('/apple-touch-icon.png'),
                'type' => 'website',
                'robots' => 'index, follow',
                'jsonLd' => $this->homepageJsonLd($canonicalUrl, $description, $liveData['featured_jobs']->take(3)),
            ],
            'liveUrl' => route('homepage.live', [], false),
        ]);
    }

    public function live()
    {
        return response()->json($this->homepageLiveData());
    }

    public function about()
    {
        $canonicalUrl = $this->absoluteUrl(route('about', [], false));
        $description = 'Learn about Galaxy Jobs, a recruitment and career platform developed and operated by Galaxy Technology.';

        return Inertia::render('public/about', [
            'stats' => [
                'jobs' => Job::public()->count(),
                'companies' => Company::where('verification_status', 'approved')->where('is_active', true)->count(),
                'candidates' => User::where('role', 'employee')->where('status', 'active')->count(),
                'applications' => Application::count(),
            ],
            'seo' => $this->pageSeo(
                'About Galaxy Jobs - Powered by Galaxy Technology',
                $description,
                $canonicalUrl,
                [
                    [
                        '@context' => 'https://schema.org',
                        '@type' => 'AboutPage',
                        'name' => 'About Galaxy Jobs',
                        'url' => $canonicalUrl,
                        'description' => $description,
                        'publisher' => ['@id' => $this->absoluteUrl('/#organization')],
                    ],
                    $this->organizationJsonLd(),
                ],
            ),
        ]);
    }

    public function contact()
    {
        $canonicalUrl = $this->absoluteUrl(route('contact', [], false));
        $description = 'Contact Galaxy Jobs and Galaxy Technology for recruitment, employer, and platform support.';

        return Inertia::render('public/contact', [
            'contactInfo' => $this->contactInfo(),
            'seo' => $this->pageSeo(
                'Contact Galaxy Jobs - Galaxy Technology',
                $description,
                $canonicalUrl,
                [
                    [
                        '@context' => 'https://schema.org',
                        '@type' => 'ContactPage',
                        'name' => 'Contact Galaxy Jobs',
                        'url' => $canonicalUrl,
                        'description' => $description,
                        'publisher' => ['@id' => $this->absoluteUrl('/#organization')],
                    ],
                    $this->organizationJsonLd(),
                ],
            ),
        ]);
    }

    public function storeContact(ContactMessageRequest $request)
    {
        $message = ContactMessage::create($request->validated());

        try {
            Mail::raw(
                "New contact message from {$message->name}\n\nEmail: {$message->email}\nPhone: {$message->phone}\nSubject: {$message->subject}\n\n{$message->message}",
                fn ($mail) => $mail
                    ->to($this->contactInfo()['email'])
                    ->subject('New Galaxy Jobs contact message: '.$message->subject)
            );
        } catch (\Throwable) {
            report('Contact message saved, but email notification could not be sent.');
        }

        return back()->with('success', 'Thank you. Your message has been received.');
    }

    public function sitemap()
    {
        $urls = collect([
            ['loc' => $this->absoluteUrl(route('home', [], false)), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => $this->absoluteUrl(route('about', [], false)), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => $this->absoluteUrl(route('contact', [], false)), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => $this->absoluteUrl(route('jobs.index', [], false)), 'priority' => '0.9', 'changefreq' => 'hourly'],
            ['loc' => $this->absoluteUrl(route('scholarships.index', [], false)), 'priority' => '0.8', 'changefreq' => 'daily'],
            ['loc' => $this->absoluteUrl(route('companies.index', [], false)), 'priority' => '0.8', 'changefreq' => 'daily'],
        ]);

        Job::with('company')->public()->latest()->limit(250)->get()->each(function (Job $job) use ($urls) {
            $urls->push([
                'loc' => $this->absoluteUrl(route('jobs.show', ['job' => $job->slug], false)),
                'lastmod' => $job->updated_at?->toAtomString(),
                'priority' => '0.7',
                'changefreq' => 'daily',
            ]);
        });

        Company::where('verification_status', 'approved')
            ->where('is_active', true)
            ->latest()
            ->limit(250)
            ->get()
            ->each(function (Company $company) use ($urls) {
                $urls->push([
                    'loc' => $this->absoluteUrl(route('companies.show', ['company' => $company->slug], false)),
                    'lastmod' => $company->updated_at?->toAtomString(),
                    'priority' => '0.6',
                    'changefreq' => 'weekly',
                ]);
            });

        Category::withCount(['jobs' => fn ($query) => $query->public()])
            ->where('is_active', true)
            ->having('jobs_count', '>', 0)
            ->get()
            ->each(function (Category $category) use ($urls) {
                $urls->push([
                    'loc' => $this->absoluteUrl(route('jobs.index', ['category_id' => $category->id], false)),
                    'lastmod' => $category->updated_at?->toAtomString(),
                    'priority' => '0.5',
                    'changefreq' => 'weekly',
                ]);
            });

        Scholarship::published()
            ->latest()
            ->limit(250)
            ->get()
            ->each(function (Scholarship $scholarship) use ($urls) {
                $urls->push([
                    'loc' => $this->absoluteUrl(route('scholarships.show', ['scholarship' => $scholarship->slug], false)),
                    'lastmod' => $scholarship->updated_at?->toAtomString(),
                    'priority' => '0.6',
                    'changefreq' => 'weekly',
                ]);
            });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return Response::make($xml, 200, ['Content-Type' => 'application/xml']);
    }

    public function robots()
    {
        return Response::make(implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /employee',
            'Disallow: /employer',
            'Sitemap: '.$this->absoluteUrl('/sitemap.xml'),
            '',
        ]), 200, ['Content-Type' => 'text/plain']);
    }

    public function jobs(Request $request)
    {
        $filterKeys = ['search', 'keyword', 'category_id', 'location_id', 'location', 'job_type', 'work_mode', 'experience_level', 'salary_min', 'salary_max', 'company_id', 'skill_id', 'deadline_from', 'deadline_to', 'is_featured', 'is_urgent', 'sort'];
        $canonicalUrl = $this->absoluteUrl(route('jobs.index', $request->only($filterKeys), false));
        $description = 'Browse verified jobs in Afghanistan by keyword, category, location, salary, job type, and experience level.';
        $jobs = Job::with(['company', 'category', 'location'])
            ->public()
            ->when($request->search ?? $request->keyword, fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")))
            ->when($request->category_id, fn ($query, $id) => $query->where('category_id', $id))
            ->when($request->location_id, fn ($query, $id) => $query->where('location_id', $id))
            ->when($request->location && ! $request->location_id, fn ($query, $location) => $query->whereHas('location', fn ($q) => $q->where('name', $location)))
            ->when($request->job_type, fn ($query, $type) => $query->where('job_type', $type))
            ->when($request->work_mode, fn ($query, $mode) => $query->where('work_mode', $mode))
            ->when($request->experience_level, fn ($query, $level) => $query->where('experience_level', $level))
            ->when($request->salary_min, fn ($query, $min) => $query->where('salary_max', '>=', $min))
            ->when($request->salary_max, fn ($query, $max) => $query->where('salary_min', '<=', $max))
            ->when($request->company_id, fn ($query, $companyId) => $query->where('company_id', $companyId))
            ->when($request->skill_id, fn ($query, $skillId) => $query->whereHas('skills', fn ($skills) => $skills->where('skills.id', $skillId)))
            ->when($request->deadline_from, fn ($query, $date) => $query->whereDate('deadline', '>=', $date))
            ->when($request->deadline_to, fn ($query, $date) => $query->whereDate('deadline', '<=', $date))
            ->when($request->boolean('is_featured'), fn ($query) => $query->where('is_featured', true))
            ->when($request->boolean('is_urgent'), fn ($query) => $query->where('is_urgent', true))
            ->when($request->sort === 'salary_high', fn ($query) => $query->orderByDesc('salary_max'))
            ->when($request->sort === 'deadline_soon', fn ($query) => $query->orderBy('deadline'))
            ->when($request->sort === 'featured', fn ($query) => $query->orderByDesc('is_featured')->latest())
            ->when(! in_array($request->sort, ['salary_high', 'deadline_soon', 'featured'], true), fn ($query) => $query->latest())
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/jobs/index', [
            'jobs' => $jobs,
            'filters' => $request->only($filterKeys),
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
            'companies' => Company::where('verification_status', 'approved')->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'skills' => Skill::orderBy('name')->get(),
            'savedSearches' => $request->user()?->savedSearches()->latest()->get() ?? [],
            'seo' => $this->pageSeo(
                'Browse Verified Jobs in Afghanistan - Galaxy Jobs',
                $description,
                $canonicalUrl,
                [
                    $this->breadcrumbJsonLd([
                        ['name' => 'Home', 'url' => $this->absoluteUrl(route('home', [], false))],
                        ['name' => 'Jobs', 'url' => $canonicalUrl],
                    ]),
                    $this->itemListJsonLd($jobs->getCollection()->map(fn (Job $job) => [
                        'name' => $job->title,
                        'url' => $this->absoluteUrl(route('jobs.show', $job, false)),
                    ])->all()),
                    $this->organizationJsonLd(),
                ],
                'jobs in Afghanistan, Kabul jobs, remote jobs Afghanistan, NGO jobs Afghanistan, private company jobs',
            ),
        ]);
    }

    public function saveSearch(Request $request)
    {
        abort_unless($request->user()?->isEmployee(), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email_alerts' => ['nullable', 'boolean'],
        ]);

        $filters = collect($request->except(['name', 'email_alerts', '_token']))
            ->filter(fn ($value) => filled($value))
            ->all();

        SavedSearch::create([
            'user_id' => $request->user()->id,
            'name' => $data['name'],
            'filters' => $filters,
            'email_alerts' => $request->boolean('email_alerts'),
        ]);

        if ($request->boolean('email_alerts')) {
            $request->user()->jobAlerts()->create([
                'keyword' => $filters['search'] ?? $filters['keyword'] ?? null,
                'category_id' => $filters['category_id'] ?? null,
                'location_id' => $filters['location_id'] ?? null,
                'is_active' => true,
            ]);
        }

        return back()->with('success', 'Search saved.');
    }

    public function showJob(Request $request, Job $job)
    {
        abort_unless($job->status === 'active' && $job->deadline->isFuture(), 404);

        $job->increment('views_count');
        $job->load(['company', 'category', 'location', 'skills']);

        return Inertia::render('public/jobs/show', [
            'job' => $job,
            'hasApplied' => $request->user()?->applications()->where('job_id', $job->id)->exists() ?? false,
            'isSaved' => $request->user()?->savedJobs()->where('job_id', $job->id)->exists() ?? false,
            'relatedJobs' => Job::with(['company', 'category', 'location'])->public()->where('category_id', $job->category_id)->whereKeyNot($job->id)->take(4)->get(),
            'seo' => $this->jobSeo($job),
        ]);
    }

    public function scholarships(Request $request)
    {
        $canonicalUrl = $this->absoluteUrl(route('scholarships.index', $request->only(['search', 'country', 'study_level', 'funding_type']), false));
        $description = 'Browse public scholarship opportunities, study funding, eligibility details, and official scholarship links through Galaxy Jobs.';
        $scholarships = Scholarship::published()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('provider', 'like', "%{$search}%")
                ->orWhere('summary', 'like', "%{$search}%")))
            ->when($request->country, fn ($query, $country) => $query->where('country', $country))
            ->when($request->study_level, fn ($query, $level) => $query->where('study_level', $level))
            ->when($request->funding_type, fn ($query, $type) => $query->where('funding_type', $type))
            ->orderByDesc('is_featured')
            ->orderByRaw('deadline is null')
            ->orderBy('deadline')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/scholarships/index', [
            'scholarships' => $scholarships,
            'filters' => $request->only(['search', 'country', 'study_level', 'funding_type']),
            'facets' => [
                'countries' => Scholarship::published()->whereNotNull('country')->distinct()->orderBy('country')->pluck('country'),
                'studyLevels' => Scholarship::published()->whereNotNull('study_level')->distinct()->orderBy('study_level')->pluck('study_level'),
                'fundingTypes' => Scholarship::published()->whereNotNull('funding_type')->distinct()->orderBy('funding_type')->pluck('funding_type'),
            ],
            'seo' => $this->pageSeo(
                'Scholarships and Study Opportunities - Galaxy Jobs',
                $description,
                $canonicalUrl,
                [
                    $this->breadcrumbJsonLd([
                        ['name' => 'Home', 'url' => $this->absoluteUrl(route('home', [], false))],
                        ['name' => 'Scholarships', 'url' => $canonicalUrl],
                    ]),
                    $this->itemListJsonLd($scholarships->getCollection()->map(fn (Scholarship $scholarship) => [
                        'name' => $scholarship->title,
                        'url' => $this->absoluteUrl(route('scholarships.show', $scholarship, false)),
                    ])->all()),
                    $this->organizationJsonLd(),
                ],
                'scholarships, study opportunities, education funding, Afghanistan scholarships, international scholarships',
            ),
        ]);
    }

    public function showScholarship(Scholarship $scholarship)
    {
        abort_unless($scholarship->is_published, 404);

        return Inertia::render('public/scholarships/show', [
            'scholarship' => $scholarship,
            'relatedScholarships' => Scholarship::published()
                ->whereKeyNot($scholarship->id)
                ->when($scholarship->study_level, fn ($query) => $query->where('study_level', $scholarship->study_level))
                ->latest()
                ->take(4)
                ->get(),
            'seo' => $this->scholarshipSeo($scholarship),
        ]);
    }

    public function companies(Request $request)
    {
        $canonicalUrl = $this->absoluteUrl(route('companies.index', $request->only('search'), false));
        $description = 'Explore verified employers and company profiles hiring through Galaxy Jobs in Afghanistan.';
        $companies = Company::withCount(['jobs' => fn ($query) => $query->public()])
            ->where('verification_status', 'approved')
            ->where('is_active', true)
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/companies/index', [
            'companies' => $companies,
            'filters' => $request->only('search'),
            'seo' => $this->pageSeo(
                'Verified Companies Hiring in Afghanistan - Galaxy Jobs',
                $description,
                $canonicalUrl,
                [
                    $this->breadcrumbJsonLd([
                        ['name' => 'Home', 'url' => $this->absoluteUrl(route('home', [], false))],
                        ['name' => 'Companies', 'url' => $canonicalUrl],
                    ]),
                    $this->itemListJsonLd($companies->getCollection()->map(fn (Company $company) => [
                        'name' => $company->name,
                        'url' => $this->absoluteUrl(route('companies.show', $company, false)),
                    ])->all()),
                    $this->organizationJsonLd(),
                ],
                'companies hiring Afghanistan, verified employers Afghanistan, Kabul companies, Afghanistan careers',
            ),
        ]);
    }

    public function showCompany(Company $company)
    {
        abort_unless($company->verification_status === 'approved' && $company->is_active, 404);

        $company->loadCount(['reviews as reviews_count' => fn ($query) => $query->where('is_approved', true)]);
        $company->rating_avg = round((float) $company->reviews()->where('is_approved', true)->avg('rating'), 1);

        return Inertia::render('public/companies/show', [
            'company' => $company,
            'jobs' => $company->jobs()->with(['category', 'location'])->public()->latest()->paginate(10),
            'reviews' => $company->reviews()->with('user:id,name')->where('is_approved', true)->latest()->take(8)->get(),
            'canReview' => request()->user()?->isEmployee() ?? false,
            'seo' => $this->companySeo($company),
        ]);
    }

    public function apply(ApplicationRequest $request, Job $job)
    {
        abort_unless($job->status === 'active' && $job->deadline->isFuture(), 404);

        $data = $request->validated();
        if ($request->hasFile('cv_file')) {
            $data['cv_file'] = $request->file('cv_file')->store('applications', 'public');
        } elseif ($request->user()->employeeProfile?->cv_file) {
            $data['cv_file'] = $request->user()->employeeProfile->cv_file;
        }

        $application = Application::firstOrCreate(
            ['job_id' => $job->id, 'user_id' => $request->user()->id],
            $data + ['status' => 'pending']
        );

        if ($application->wasRecentlyCreated) {
            $application->statusUpdates()->create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'note' => 'Application submitted.',
            ]);
        }

        return back()->with('success', 'Application submitted.');
    }

    public function storeCompanyReview(Request $request, Company $company)
    {
        abort_unless($company->verification_status === 'approved' && $company->is_active, 404);

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:2000'],
        ]);

        CompanyReview::updateOrCreate(
            ['company_id' => $company->id, 'user_id' => $request->user()->id],
            $data + ['is_approved' => true],
        );

        return back()->with('success', 'Company review saved.');
    }

    public function toggleSave(Request $request, Job $job)
    {
        abort_unless($request->user()?->isEmployee(), 403);

        $saved = SavedJob::where('job_id', $job->id)->where('user_id', $request->user()->id)->first();
        $saved ? $saved->delete() : SavedJob::create(['job_id' => $job->id, 'user_id' => $request->user()->id]);

        return back()->with('success', $saved ? 'Job removed from saved jobs.' : 'Job saved.');
    }

    private function homepageLiveData(): array
    {
        return [
            'stats' => [
                ...Cache::remember('homepage.stats', 60, fn () => [
                    'jobs' => Job::public()->count(),
                    'companies' => Company::where('verification_status', 'approved')->where('is_active', true)->count(),
                    'categories' => Category::where('is_active', true)->count(),
                    'candidates' => User::where('role', 'employee')->where('status', 'active')->count(),
                    'applications' => Application::count(),
                ]),
            ],
            'featured_jobs' => Job::with(['company', 'category', 'location'])
                ->public()
                ->latest()
                ->take(6)
                ->get(),
            'featured_companies' => Company::withCount(['jobs' => fn ($query) => $query->public()])
                ->where('verification_status', 'approved')
                ->where('is_active', true)
                ->whereHas('jobs', fn ($query) => $query->public())
                ->orderByDesc('jobs_count')
                ->take(6)
                ->get(),
            'categories' => Category::withCount(['jobs' => fn ($query) => $query->public()])
                ->where('is_active', true)
                ->orderByDesc('jobs_count')
                ->orderBy('name')
                ->take(10)
                ->get(),
        ];
    }

    private function homepageJsonLd(string $canonicalUrl, string $description, $jobs): array
    {
        $organization = [
            '@type' => 'Organization',
            '@id' => $this->absoluteUrl('/#organization'),
            'name' => config('app.name', 'Galaxy Jobs'),
            'url' => $this->absoluteUrl('/'),
            'logo' => $this->absoluteUrl('/apple-touch-icon.png'),
        ];

        return [
            [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                '@id' => $this->absoluteUrl('/#website'),
                'name' => config('app.name', 'Galaxy Jobs'),
                'url' => $this->absoluteUrl('/'),
                'description' => $description,
                'publisher' => ['@id' => $this->absoluteUrl('/#organization')],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => $this->absoluteUrl(route('jobs.index', ['keyword' => '{search_term_string}'], false)),
                    'query-input' => 'required name=search_term_string',
                ],
            ],
            $organization,
            ...$jobs->map(fn (Job $job) => $this->jobPostingJsonLd($job))->values()->all(),
        ];
    }

    private function pageSeo(string $title, string $description, string $canonicalUrl, array $jsonLd, ?string $keywords = null): array
    {
        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords ?? 'Galaxy Jobs, Galaxy Technology, Afghanistan jobs, recruitment platform, verified employers',
            'canonical' => $canonicalUrl,
            'image' => $this->absoluteUrl('/apple-touch-icon.png'),
            'type' => 'website',
            'robots' => 'index, follow',
            'jsonLd' => $jsonLd,
        ];
    }

    private function jobSeo(Job $job): array
    {
        $description = Str::limit(strip_tags($job->description), 160);
        $canonicalUrl = $this->absoluteUrl(route('jobs.show', $job, false));

        return $this->pageSeo(
            $job->title.' at '.$job->company->name.' - Galaxy Jobs',
            $description,
            $canonicalUrl,
            [
                $this->jobPostingJsonLd($job),
                $this->breadcrumbJsonLd([
                    ['name' => 'Home', 'url' => $this->absoluteUrl(route('home', [], false))],
                    ['name' => 'Jobs', 'url' => $this->absoluteUrl(route('jobs.index', [], false))],
                    ['name' => $job->title, 'url' => $canonicalUrl],
                ]),
                $this->organizationJsonLd(),
            ],
            implode(', ', array_filter([$job->title, $job->company?->name, $job->category?->name, $job->location?->name, 'jobs in Afghanistan'])),
        );
    }

    private function companySeo(Company $company): array
    {
        $description = Str::limit(strip_tags($company->description), 160);
        $canonicalUrl = $this->absoluteUrl(route('companies.show', $company, false));

        return $this->pageSeo(
            $company->name.' Careers - Galaxy Jobs',
            $description,
            $canonicalUrl,
            [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Organization',
                    '@id' => $canonicalUrl.'#organization',
                    'name' => $company->name,
                    'url' => $canonicalUrl,
                    'description' => $description,
                    'email' => $company->email,
                    'telephone' => $company->phone,
                    'address' => [
                        '@type' => 'PostalAddress',
                        'streetAddress' => $company->address,
                        'addressCountry' => 'AF',
                    ],
                    ...($company->rating_avg > 0 && $company->reviews_count > 0 ? [
                        'aggregateRating' => [
                            '@type' => 'AggregateRating',
                            'ratingValue' => $company->rating_avg,
                            'reviewCount' => $company->reviews_count,
                        ],
                    ] : []),
                ],
                $this->breadcrumbJsonLd([
                    ['name' => 'Home', 'url' => $this->absoluteUrl(route('home', [], false))],
                    ['name' => 'Companies', 'url' => $this->absoluteUrl(route('companies.index', [], false))],
                    ['name' => $company->name, 'url' => $canonicalUrl],
                ]),
                $this->organizationJsonLd(),
            ],
            implode(', ', array_filter([$company->name, $company->industry, 'company jobs Afghanistan', 'careers Afghanistan'])),
        );
    }

    private function scholarshipSeo(Scholarship $scholarship): array
    {
        $description = Str::limit(strip_tags($scholarship->summary ?: $scholarship->description), 160);
        $canonicalUrl = $this->absoluteUrl(route('scholarships.show', $scholarship, false));

        return $this->pageSeo(
            $scholarship->title.' - Scholarship - Galaxy Jobs',
            $description,
            $canonicalUrl,
            [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'EducationalOccupationalProgram',
                    '@id' => $canonicalUrl.'#scholarship',
                    'name' => $scholarship->title,
                    'description' => strip_tags($scholarship->description),
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => $scholarship->provider ?? 'Galaxy Jobs',
                    ],
                    'url' => $canonicalUrl,
                    'applicationDeadline' => $scholarship->deadline?->toDateString(),
                    'educationalProgramMode' => $scholarship->study_level,
                    'programPrerequisites' => strip_tags((string) $scholarship->eligibility),
                ],
                $this->breadcrumbJsonLd([
                    ['name' => 'Home', 'url' => $this->absoluteUrl(route('home', [], false))],
                    ['name' => 'Scholarships', 'url' => $this->absoluteUrl(route('scholarships.index', [], false))],
                    ['name' => $scholarship->title, 'url' => $canonicalUrl],
                ]),
                $this->organizationJsonLd(),
            ],
            implode(', ', array_filter([$scholarship->title, $scholarship->provider, $scholarship->country, $scholarship->study_level, 'scholarships'])),
        );
    }

    private function jobPostingJsonLd(Job $job): array
    {
        $job->loadMissing(['company', 'category', 'location', 'skills']);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'JobPosting',
            '@id' => $this->absoluteUrl(route('jobs.show', $job, false)).'#jobposting',
            'title' => $job->title,
            'description' => strip_tags($job->description),
            'datePosted' => $job->created_at?->toDateString(),
            'validThrough' => $job->deadline?->toAtomString(),
            'employmentType' => strtoupper($job->job_type ?? 'FULL_TIME'),
            'url' => $this->absoluteUrl(route('jobs.show', $job, false)),
            'identifier' => [
                '@type' => 'PropertyValue',
                'name' => config('app.name', 'Galaxy Jobs'),
                'value' => (string) $job->id,
            ],
            'directApply' => true,
            'hiringOrganization' => [
                '@type' => 'Organization',
                'name' => $job->company?->name ?? config('app.name', 'Galaxy Jobs'),
                'sameAs' => $job->company?->website ?: $this->absoluteUrl(route('companies.show', $job->company, false)),
                'logo' => $job->company?->logo ? $this->absoluteUrl('/storage/'.$job->company->logo) : $this->absoluteUrl('/apple-touch-icon.png'),
            ],
            'jobLocation' => [
                '@type' => 'Place',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => $job->location?->name ?? 'Afghanistan',
                    'addressCountry' => 'AF',
                ],
            ],
            ...($job->salary_min || $job->salary_max ? [
                'baseSalary' => [
                    '@type' => 'MonetaryAmount',
                    'currency' => $job->salary_currency ?? 'AFN',
                    'value' => [
                        '@type' => 'QuantitativeValue',
                        'minValue' => $job->salary_min,
                        'maxValue' => $job->salary_max,
                        'unitText' => 'MONTH',
                    ],
                ],
            ] : []),
            'occupationalCategory' => $job->category?->name,
            'skills' => $job->skills?->pluck('name')->join(', '),
            'applicantLocationRequirements' => [
                '@type' => 'Country',
                'name' => 'Afghanistan',
            ],
        ];
    }

    private function breadcrumbJsonLd(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)->values()->map(fn ($item, $index) => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ])->all(),
        ];
    }

    private function itemListJsonLd(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'itemListElement' => collect($items)->values()->map(fn ($item, $index) => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'url' => $item['url'],
            ])->all(),
        ];
    }

    private function organizationJsonLd(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => $this->absoluteUrl('/#organization'),
            'name' => 'Galaxy Technology',
            'url' => $this->absoluteUrl('/'),
            'logo' => $this->absoluteUrl('/apple-touch-icon.png'),
            'sameAs' => [
                'https://galaxytechology.com',
            ],
        ];
    }

    private function contactInfo(): array
    {
        return [
            'email' => 'galaxytech2030@gmail.com',
            'phone' => '+93 77 197 8659',
            'address' => 'Balkh, Afghanistan',
        ];
    }

    private function absoluteUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return rtrim(config('app.url'), '/').'/'.ltrim($path, '/');
    }
}
